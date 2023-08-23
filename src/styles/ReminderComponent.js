import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  reminderView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 17,
    height: 17,
    borderRadius: 100,
    backgroundColor: "black",
  },
  checkboxUnchecked: {
    backgroundColor: "white",
  },
  reminderText: {
    fontSize: 20,
    marginBottom: 5,
  },
  reminderTextStrikeThrough: {
    // textDecorationLine: 'line-through',
    // textDecorationStyle: 'solid'
    color: "#b5b5b5",
  }
});

export default styles;
