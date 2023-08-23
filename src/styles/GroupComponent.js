import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  collapseGroupView: {
    position: "absolute",
    right: 0,
  },
  groupPressableText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    height: 1,
    width: "90%",
    backgroundColor: "#CED0CE",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  groupActionsRenderView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 5,
    alignItems: "flex-end",
  },
  deleteGroupText: {
    marginBottom: 6,
    fontSize: 14,
    color: "#ff6861",
    textAlign: "center",
  },
  addNewReminderToGroupText: {
    marginBottom: 6,
    fontSize: 16,
    color: "#007aff",
    textAlign: "center",
  },
  groupView: {
    backgroundColor: "#e8e8e8",
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  groupTitleRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 5,
    marginBottom: 8,
  }
});

export default styles;
