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
      
      Alert.alert(`Categoria ${name} cadastrada com o id ${response.insertedRowId}.`)
  
    } catch (error) {
      throw error
    }
  }

  
  async function update() {
    try {
      const response = await categoryDatabase.update({ id: Number(id), name })
      
      // Alert.alert(`Categoria ${name} cadastrada com o id ${response.insertedRowId}.`)
  
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

  function details(item: CategoryDatabase) {
    setId(String(item.id))
    setName(item.name)
  }

  async function handleSave() {
    if(id) {
      update()
    } else {
      create()
    }

    setId("")
    setName("")
    await list()
  }

  useEffect(() => {
    list()
  }, [search])
  return (
    <>
      <Input placeholder="Nome da categoria" onChangeText={setName} value={name} />
      
      <Button title={id ? 'Salvar Categoria' : 'Adicionar Categoria'} onPress={handleSave} />

      <Input placeholder="Pesquisar" onChangeText={setSearch} />

      <FlatList 
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CategoryCard name={item.name} onPress={() => details(item)} />}
        contentContainerStyle={{gap: 10}}
      />
    </>
  )
}