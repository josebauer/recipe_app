import { Text, View } from "react-native";
import Categories from "@/components/Categories/Categories";
import styles from "./CategoryManagementStyles"

export default function CategoryManagement() {
  return (
    <View style={styles.view}>
      <Text style={styles.title}>Gerenciamento de Categorias</Text>
      <Categories />
    </View>
  )
}