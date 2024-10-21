import { Recipe, useRecipeDatabase } from "@/database/useRecipeDatabase"
import { useEffect, useState } from "react"
import { FlatList, Text, View } from "react-native"
import Input from "../Input/Input"

type RecipeWithCategory = Recipe & { categoryName: string }

export default function ListRecipes() {
  const [recipes, setRecipes] = useState<RecipeWithCategory[]>([]);
  const [groupedRecipes, setGroupedRecipes] = useState<{ [key: string]: RecipeWithCategory[] }>({});
  const [search, setSearch] = useState("");

  const recipeDatabse = useRecipeDatabase()

  async function list() {
    try {
      const response = await recipeDatabse.searchRecipeByName(search)
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
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginBottom: 10 }}>{category}</Text>
            {groupedRecipes[category].map((recipe) => (
              <Text key={recipe.id} style={{ paddingLeft: 10 }}>{recipe.name}</Text>
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