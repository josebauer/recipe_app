import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Button, ScrollView, Text } from "react-native";
import { useRecipeDatabase } from "@/database/useRecipeDatabase";

import { Ingredient } from "../Recipes/RecipeManagement";
import styles from "./RecipeDetailsStyles";
import Input from "@/components/Input/Input";

export default function RecipeDetails() {
  const [recipe, setRecipe] = useState<null | {
    name: string;
    instructions: string;
    categoryName: string;
    ingredients: { name: string; quantity: number; measure: string }[];
  }>(null);

  const [proportion, setProportion] = useState(1); 
  const [adjustedIngredients, setAdjustedIngredients] = useState<Ingredient[]>([]);

  const recipeDatabase = useRecipeDatabase();
  const params = useLocalSearchParams<{ id: string }>()

  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        const details = await recipeDatabase.getRecipeDetails(Number(params.id));
        setRecipe(details);
        setAdjustedIngredients(details.ingredients);
      } catch (error) {
        console.error("Erro ao obter detalhes da receita:", error);
      }
    }

    fetchRecipeDetails();
  }, [Number(params.id)]);

  const adjustIngredients = () => {
    if (recipe) {
      const newIngredients = recipe.ingredients.map((ingredient) => ({
        ...ingredient,
        quantity: ingredient.quantity * proportion,
      }));
      setAdjustedIngredients(newIngredients);
    }
  };

  if (!recipe) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 40, gap: 12 }}>
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={{ fontStyle: "italic" }}>Categoria: {recipe.categoryName}</Text>
      <Text style={styles.subtitle}>Ingredientes:</Text>
      {adjustedIngredients.map((ingredient, index) => (
        <Text key={index}>
          - {ingredient.quantity} {ingredient.measure} de {ingredient.name}
        </Text>
      ))}
      <Text style={styles.subtitle}>Modo de Preparo:</Text>
      <Text>{recipe.instructions}</Text>
      <Text style={styles.subtitle}>Proporção:</Text>
      <Input 
        keyboardType="numeric"
        placeholder="Digite a proporção desejada. Ex: 3" 
        onChangeText={(text) => setProportion(Number(text) || 1)} 
      />
      <Button title="Calcular proporção" onPress={adjustIngredients} />
    </ScrollView>
  );
}