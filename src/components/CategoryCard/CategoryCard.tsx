import { Pressable, PressableProps, Text } from "react-native";
import styles from "./CategoryCardStyles"

type Props = PressableProps & {
  name: string
}

export default function CategoryCard({name, ...rest}: Props) {
  return (
    <Pressable style={styles.pressable} {...rest}>
      <Text style={styles.text}>
        {name}
      </Text>
    </Pressable>
  )
}