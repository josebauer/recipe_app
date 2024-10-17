import { Alert, Button, FlatList } from "react-native";
import { useEffect, useState } from "react";

import Input from "../Input/Input";
import CategoryCard from "../CategoryCard/CategoryCard";

import { useCategoryDatabase, CategoryDatabase } from "@/database/useCategoryDatabase";

export default function Categories() {
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [search, setSearch] = useState("")
  const [categories, setCategories] = useState<CategoryDatabase[]>([])

  const categoryDatabase = useCategoryDatabase()

  async function create() {
    try {
      const response = await categoryDatabase.create({ name })
      
      list()
      
      Alert.alert(`Categoria ${name} cadastrada com o id ${response.insertedRowId}.`)
  
      setName("") 
    } catch (error) {
      throw error
    }
  }

  async function list() {
    try {
      const response = await categoryDatabase.searchByName(search)     
      setCategories(response) 
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    list()
  }, [search])
  return (
    <>
      <Input placeholder="Nome da categoria" onChangeText={setName} value={name} />
      
      <Button title="Adicionar categoria" onPress={create} />

      <Input placeholder="Pesquisar" onChangeText={setSearch} />

      <FlatList 
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CategoryCard name={item.name} />}
        contentContainerStyle={{gap: 10}}
      />
    </>
  )
}