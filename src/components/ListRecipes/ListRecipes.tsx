import { Recipe, useRecipeDatabase } from "@/database/useRecipeDatabase"
import { useEffect, useState } from "react"
import { Alert, FlatList, Text, View } from "react-native"
import Input from "../Input/Input"
import { router } from "expo-router"
import ActionCard from "../ActionCard/ActionCard"

type RecipeWithCategory = Recipe & { categoryName: string }

export default function ListRecipes() {
  const [recipes, setRecipes] = useState<RecipeWithCategory[]>([]);
  const [groupedRecipes, setGroupedRecipes] = useState<{ [key: string]: RecipeWithCategory[] }>({});
  const [search, setSearch] = useState("");

  const recipeDatabase = useRecipeDatabase()

  async function list() {
    try {
      const response = await recipeDatabase.searchRecipeByName(search)
      setRecipes(response)

      const grouped = response.reduce((acc: { [key: string]: RecipeWithCategory[] }, recipe) => {
        const category = recipe.categoryName || "Sem Categoria";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(recipe);
        return acc;
      }, {});

      setGroupedRecipes(grouped);
    } catch (error) {
      throw error
    }
  }

  async function remove(id: number) {
    Alert.alert(
      'Atenção',
      'Tem certeza que deseja deletar essa receita?',
      [
        {
          text: 'Cancelar',
          onPress: () => { },
          style: 'cancel',
        },
        {
          text: 'Deletar',
          onPress: async () => {
            try {
              await recipeDatabase.remove(id)
              await list()
            } catch (error) {
              console.log(error)
            }
          },
        },
      ],
    )
  }

  useEffect(() => {
    list()
  }, [search])

  return (
    <>
      <Input placeholder="Pesquisar receitas" onChangeText={setSearch} />
      <FlatList
        data={Object.keys(groupedRecipes)}
        keyExtractor={(item) => item}
        renderItem={({ item: category }) => (
          <View style={{ marginBottom: 20, gap: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10, fontStyle: "italic" }}>{category}</Text>
            {groupedRecipes[category].map((recipe) => (
              <ActionCard
                key={recipe.id}
                name={recipe.name}
                onPress={() => router.navigate(`/RecipeDetails/${recipe.id}`)}
                onDelete={() => remove(recipe.id)}
                onEdit={() => router.navigate(`/Recipes/RecipeManagement?recipeId=${recipe.id}`)}
              />
            ))}
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>Não há receitas cadastradas.</Text>
          </View>
        )}
        contentContainerStyle={{ gap: 10 }}
      />
    </>

  )
}