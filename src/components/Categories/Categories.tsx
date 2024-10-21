import { Alert, Button, FlatList, Text, View } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
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

      if (name === '') {
        Alert.alert("Atenção", "O nome da categoria não pode estar vazio.")
      } else {
        const response = await categoryDatabase.create(name)

        Alert.alert('Sucesso', `Categoria ${name} cadastrada com o id ${response.insertedRowId}.`)
      }

    } catch (error) {
      throw error
    }
  }

  async function update() {
    try {
      if (name === '') {
        Alert.alert("Atenção", "O nome da categoria não pode estar vazio.")
      } else {
        await categoryDatabase.update({ id: Number(id), name })
        Alert.alert('Sucesso' ,`Categoria atualizada para ${name}.`)
      }
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

  async function remove(id: number) {
    Alert.alert(
      'Atenção',
      'Tem certeza que deseja deletar essa categoria?',
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
              await categoryDatabase.remove(id)
              setId("")
              setName("")
              await list()
            } catch (error) {
              console.log(error)
            }
          },
        },
      ],
    )
  }

  function details(item: CategoryDatabase) {
    setId(String(item.id))
    setName(item.name)
  }

  async function handleSave() {
    if (id) {
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

      <Button title={id ? 'Salvar Categoria' : '+ Adicionar Categoria'} onPress={handleSave} />

      <Input placeholder="Pesquisar" onChangeText={setSearch} />

      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <CategoryCard
            name={item.name}
            onPress={() => router.navigate("../CategoryDetails/" + item.id)}
            onDelete={() => remove(item.id)}
            onEdit={() => details(item)}
          />
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text>Não há categorias cadastradas.</Text>
          </View>
        )}
        contentContainerStyle={{ gap: 10 }}
      />
    </>
  )
}