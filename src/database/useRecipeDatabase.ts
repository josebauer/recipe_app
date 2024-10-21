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

  async function create(recipe: Omit<Recipe, "id">, ingredients: { name: string; quantity: number; measure: string }[]) {
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

  async function addRecipeIngredient(recipeId: string, ingredientData: { name: string; quantity: number; measure: string }) {
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

    if (!ingredientId) throw new Error(`Erro ao adicionar ingrediente: ${ingredientData.name}`);

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

    if (!measureId) throw new Error(`Erro ao adicionar medida: ${ingredientData.measure}`);

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
      const response = await database.getAllAsync<Recipe & { categoryName: string }>(query, `%${name}%`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  return { create, getAllMeasures, searchRecipeByName }
}
