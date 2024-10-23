import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  pressable: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#ad0000",
    borderRadius: 10,
    padding: 24,
    gap: 10
  },

  text: {
    color: "#FFF",
    fontWeight: "bold",
    fontStyle: "italic",
    flex: 1
  }
});

export default styles