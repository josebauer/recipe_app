import styles from "./TextAreaStyles";
import { TextInput, TextInputProps } from "react-native";

export default function ({ ...reset }: TextInputProps) {
  return (
    <TextInput {...reset} style={styles.textInput} multiline={true} selectionColor='#a0a0a0' />
  )
}