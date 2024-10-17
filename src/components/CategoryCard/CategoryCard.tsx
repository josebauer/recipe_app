import { Pressable, PressableProps, Text, TouchableOpacity } from "react-native";
import styles from "./CategoryCardStyles"
import { MaterialIcons } from "@expo/vector-icons"

type Props = PressableProps & {
  name: string,
  onDelete: () => void
}

export default function CategoryCard({ name, onDelete, ...rest }: Props) {
  return (
    <Pressable style={styles.pressable} {...rest}>
      <Text style={styles.text}>
        {name}
      </Text>
      <TouchableOpacity onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </Pressable>
  )
}