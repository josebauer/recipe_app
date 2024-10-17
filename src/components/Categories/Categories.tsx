import { Alert, Button } from "react-native";
import { useState } from "react";

import Input from "../Input/Input";
import { useCategoryDatabase } from "@/database/useCategoryDatabase";

export default function Categories() {
  const [id, setId] = useState("")
  const [name, setName] = useState("")
  const [categories, setCategories] = useState([])

  const categoryDatabase = useCategoryDatabase()

  async function create() {
    const response = await categoryDatabase.create({ name })
    Alert.alert(`Categoria ${name} cadastrada com o id ${response.insertedRowId}.`)

    setName("")
  }

  return (
    <>
      <Input placeholder="Nome da categoria" onChangeText={setName} value={name} />
      <Button title="Adicionar categoria" onPress={create} />
    </>
  )
}