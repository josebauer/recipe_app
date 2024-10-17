import { TextInput, TextInputProps } from "react-native"
import styles from "./InputStyles"

export default function Input({ ...reset }: TextInputProps) {
  return (
    <TextInput style={styles.textInput} {...reset} selectionColor='#a0a0a0'/>
  )
}