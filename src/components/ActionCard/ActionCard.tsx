import { Pressable, PressableProps, Text, TouchableOpacity } from "react-native";
import styles from "./ActionCardStyles"
import { MaterialIcons } from "@expo/vector-icons"

type Props = PressableProps & {
  name: string,
  onDelete: () => void
  onEdit: () => void
}

export default function ActionCard({ name, onDelete, onEdit, ...rest }: Props) {
  return (
    <Pressable style={styles.pressable} {...rest}>
      <Text style={styles.text}>
        {name}
      </Text>
      <TouchableOpacity onPress={onDelete}>
        <MaterialIcons name="delete" size={24} color="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onEdit}>
        <MaterialIcons name="edit" size={24} color="#FFF" />
      </TouchableOpacity>
    </Pressable>
  )
}