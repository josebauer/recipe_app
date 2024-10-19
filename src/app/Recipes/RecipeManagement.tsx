import Recipes from "@/components/Recipes/Recipes";
import { ScrollView, Text, View } from "react-native";

import styles from "./RecipeManagementStyles";

export default function RecipeManagement() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Gerenciador de Receitas</Text>
      <Recipes />
    </ScrollView>
  )
}