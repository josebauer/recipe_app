import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { Text, View } from "react-native";
import styles from "./CategoryDetailsStyles";
import { useCategoryDatabase } from "@/database/useCategoryDatabase";

export default function CategoryDetails() {
  const [name, setName] = useState("")
  
  const categoryDatabase = useCategoryDatabase()
  const params = useLocalSearchParams<{ id: string }>()
  
  useEffect(() => {
    if(params.id) {
      categoryDatabase.show(Number(params.id)).then(response => {
        if(response) {
          setName(response.name)
        }
      })
    }
  }, [params.id])
  
  
  return (
    <View style={styles.view}>
      <Text style={styles.title}>Detalhes da Categoria</Text>
      <Text style={styles.text}>ID: {params.id}</Text>
      <Text style={styles.text}>Nome: {name}</Text>
    </View>
  )
}