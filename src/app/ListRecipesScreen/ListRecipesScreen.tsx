import { Text, View } from "react-native";
import styles from "./ListRecipesScreenStyles";
import ListRecipes from "@/components/ListRecipes/ListRecipes";

export default function ListRecipesScreen() {
  return (
    <View style={styles.view}>
      <Text style={styles.title}>Receitas</Text>
      <ListRecipes />
    </View>
  )
}