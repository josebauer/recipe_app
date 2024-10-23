import { useSQLiteContext } from "expo-sqlite";

export type Recipe = {
  id: number;
  name: string;
  description: string;
  instructions: string;
  categoryId: number;
};

export type Ingredient = {
  id: number;
  name: string;
};

export type Measure = {
  id: number;
  unit: string;
};

export type RecipeIngredient = {
  id: number;
  recipeId: number;
  ingredientId: number;
  quantity: number;
  measureId: number;
};

export function useRecipeDatabase() {
  const database = useSQLiteContext();

  async function create(
    recipe: Omit<Recipe, "id">,
    ingredients: { name: string; quantity: number; measure: string }[]
  ) {
    const statement = await database.prepareAsync(
      "INSERT INTO recipes (name, description, instructions, category_id) VALUES ($name, $description, $instructions, $categoryId)"
    );

    try {
      const result = await statement.executeAsync({
        $name: recipe.name,
        $description: recipe.description,
        $instructions: recipe.instructions,
        $categoryId: recipe.categoryId,
      });

      const insertedRowId = result.lastInsertRowId.toLocaleString();

      // Adicionar ingredientes associados
      for (const ingredient of ingredients) {
        await addRecipeIngredient(insertedRowId, ingredient);
      }

      return { insertedRowId };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  async function addRecipeIngredient(
    recipeId: string,
    ingredientData: { name: string; quantity: number; measure: string }
  ) {
    // Inserir ingrediente
    const ingredientStatement = await database.prepareAsync(
      "INSERT OR IGNORE INTO ingredients (name) VALUES ($name)"
    );

    await ingredientStatement.executeAsync({
      $name: ingredientData.name,
    });

    // Obter ID do ingrediente
    const ingredientResult = await database.getFirstAsync<Ingredient>(
      "SELECT id FROM ingredients WHERE name = ?",
      ingredientData.name
    );
    const ingredientId = ingredientResult?.id;

    if (!ingredientId)
      throw new Error(`Erro ao adicionar ingrediente: ${ingredientData.name}`);

    // Inserir unidade de medida
    const measureStatement = await database.prepareAsync(
      "INSERT OR IGNORE INTO measures (unit) VALUES ($unit)"
    );

    await measureStatement.executeAsync({
      $unit: ingredientData.measure,
    });

    // Obter ID da unidade de medida
    const measureResult = await database.getFirstAsync<Measure>(
      "SELECT id FROM measures WHERE unit = ?",
      ingredientData.measure
    );
    const measureId = measureResult?.id;

    if (!measureId)
      throw new Error(`Erro ao adicionar medida: ${ingredientData.measure}`);

    // Associar ingrediente à receita
    const recipeIngredientStatement = await database.prepareAsync(
      "INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, measure_id) VALUES ($recipeId, $ingredientId, $quantity, $measureId)"
    );

    await recipeIngredientStatement.executeAsync({
      $recipeId: recipeId,
      $ingredientId: ingredientId,
      $quantity: ingredientData.quantity,
      $measureId: measureId,
    });

    await ingredientStatement.finalizeAsync();
    await measureStatement.finalizeAsync();
    await recipeIngredientStatement.finalizeAsync();
  }

  async function getAllMeasures(): Promise<Measure[]> {
    try {
      const query = "SELECT * FROM measures";
      const response = await database.getAllAsync<Measure>(query);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function searchRecipeByName(name: string) {
    try {
      const query = `
        SELECT recipes.*, categories.name as categoryName
        FROM recipes
        JOIN categories ON recipes.category_id = categories.id
        WHERE recipes.name LIKE ?
        ORDER BY categories.name, recipes.name
      `;
      const response = await database.getAllAsync<
        Recipe & { categoryName: string }
      >(query, `%${name}%`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  async function remove(id: number) {
    try {
      await database.execAsync("DELETE FROM recipes WHERE id = " + id);
    } catch (error) {
      throw error;
    }
  }

  async function getRecipeDetails(recipeId: number) {
    try {
      const query = `
        SELECT
          recipes.id as recipeId,
          recipes.name as recipeName,
          recipes.description,
          recipes.instructions,
          recipes.category_id as categoryId,
          categories.name as categoryName,
          recipe_ingredients.quantity,
          measures.unit as measureUnit,
          ingredients.name as ingredientName
        FROM recipes
        LEFT JOIN categories ON recipes.category_id = categories.id
        LEFT JOIN recipe_ingredients ON recipes.id = recipe_ingredients.recipe_id
        LEFT JOIN ingredients ON recipe_ingredients.ingredient_id = ingredients.id
        LEFT JOIN measures ON recipe_ingredients.measure_id = measures.id
        WHERE recipes.id = ?
      `;

      const response = await database.getAllAsync<{
        recipeId: number;
        recipeName: string;
        description: string;
        instructions: string;
        categoryId: number;
        categoryName: string;
        quantity: number;
        measureUnit: string;
        ingredientName: string;
      }>(query, recipeId);

      if (response.length === 0) {
        throw new Error("Receita não encontrada");
      }

      // Organizar as informações em um formato mais fácil de usar:
      const recipeDetails = {
        id: response[0].recipeId,
        name: response[0].recipeName,
        description: response[0].description,
        instructions: response[0].instructions,
        categoryId: response[0].categoryId,
        categoryName: response[0].categoryName,
        ingredients: response.map((item) => ({
          name: item.ingredientName,
          quantity: item.quantity,
          measure: item.measureUnit,
        })),
      };

      return recipeDetails;
    } catch (error) {
      throw error;
    }
  }

  async function update(
    recipe: Recipe,
    ingredients: { name: string; quantity: number; measure: string }[]
  ) {
    const statement = await database.prepareAsync(
      "UPDATE recipes SET name = $name, description = $description, instructions = $instructions, category_id = $categoryId WHERE id = $id"
    );

    try {
      await statement.executeAsync({
        $id: recipe.id,
        $name: recipe.name,
        $description: recipe.description,
        $instructions: recipe.instructions,
        $categoryId: recipe.categoryId,
      });

      // Primeiro, removemos todos os ingredientes associados à receita
      await database.execAsync(
        "DELETE FROM recipe_ingredients WHERE recipe_id = " + recipe.id
      );

      // Adicionamos os ingredientes atualizados
      for (const ingredient of ingredients) {
        await addRecipeIngredient(recipe.id.toString(), ingredient);
      }

      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      await statement.finalizeAsync();
    }
  }

  return {
    create,
    getAllMeasures,
    searchRecipeByName,
    remove,
    getRecipeDetails,
    update,
  };
}
