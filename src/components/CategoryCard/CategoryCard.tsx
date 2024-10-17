import { Pressable, PressableProps, Text, TouchableOpacity } from "react-native";
import styles from "./CategoryCardStyles"
import { MaterialIcons } from "@expo/vector-icons"

type Props = PressableProps & {
  name: string,
  onDelete: () => void
  onOpen: () => void
}

export default function CategoryCard({ name, onDelete, onOpen, ...rest }: Props) {
  return (
    <Pressable style={styles.pressable} {...rest}>
      <Text style={styles.text}>
        {name}
      </Text>
      <TouchableOpacity onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onOpen}>
        <MaterialIcons name="visibility" size={24} color="blue" />
      </TouchableOpacity>
    </Pressable>
  )
}