import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  addNewReminderSelectedGroupPill: {
    position: "absolute",
    top: -50,
    borderRadius: 100,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginTop: 5,
    backgroundColor: "#419dff",
  },
  addNewReminderSelectedGroupPillPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addNewReminderInputView: {
    width: "100%",
    flexDirection: "row",
    marginTop: 10,
  },
  newReminderInput: {
    height: 45,
    flex: 1,
    borderColor: "gray",
    borderWidth: 0.8,
    borderRadius: 10,
    marginBottom: 25,
    paddingHorizontal: 10,
  },
});

export default styles;
