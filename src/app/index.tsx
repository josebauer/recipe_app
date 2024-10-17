import { Text, View } from "react-native";
import styles from "./indexStyles";
import Categories from "@/components/Categories/Categories";

export default function () {
  return (
    <View style={styles.view}>
      <Text style={styles.title}>Receitas na mão</Text>
      <Categories />
    </View>
  )
}