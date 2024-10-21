import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { useCategoryDatabase } from "@/database/useCategoryDatabase";
import { useRecipeDatabase } from "@/database/useRecipeDatabase";
import styles from "./RecipeDetailsStyles";


export default function RecipeDetails() {
  const [recipe, setRecipe] = useState<null | {
    name: string;
    description: string;
    instructions: string;
    categoryName: string;
    ingredients: { name: string; quantity: number; measure: string }[];
  }>(null);

  const recipeDatabase = useRecipeDatabase();
  const params = useLocalSearchParams<{ id: string }>()

  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        const details = await recipeDatabase.getRecipeDetails(Number(params.id));
        setRecipe(details);
      } catch (error) {
        console.error("Erro ao obter detalhes da receita:", error);
      }
    }

    fetchRecipeDetails();
  }, [Number(params.id)]);

  if (!recipe) {
    return <Text>Carregando...</Text>;
  }

  return (
    <ScrollView style={styles.view}>
      <Text style={styles.title}>{recipe.name}</Text>
      <Text style={{ fontStyle: "italic" }}>Categoria: {recipe.categoryName}</Text>
      <Text style={{ marginVertical: 10 }}>{recipe.description}</Text>
      <Text style={styles.subtitle}>Ingredientes:</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <Text key={index}>
          - {ingredient.quantity} {ingredient.measure} de {ingredient.name}
        </Text>
      ))}
      <Text style={styles.subtitle}>Modo de Preparo:</Text>
      <Text>{recipe.instructions}</Text>
    </ScrollView>
  );
}