import { Button, Text, View } from "react-native";
import styles from "./indexStyles"
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.view}>
      <Text style={styles.title}>Receitas na mão</Text>
      <Button title="Gerenciar Receitas" color="#ad0000" onPress={() => router.navigate("/Recipes/RecipeManagement")} />
      <Button title="Gerenciar Categorias" color="#ad0000" onPress={() => router.navigate("/Categories/CategoryManagement")} />
    </View>
  )
}