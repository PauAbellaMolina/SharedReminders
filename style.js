import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  devBorder: {
    borderWidth: 1,
    borderColor: 'red'
  },
  separator: {
    height: 1,
    width: '90%',
    backgroundColor: '#CED0CE',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 10
  },
  bigTitle: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    width: 17,
    height: 17,
    borderRadius: 100,
    backgroundColor: 'black'
  },
  checkboxUnchecked: {
    backgroundColor: 'white'
  },
  container: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  groupView: {
    backgroundColor: '#e8e8e8',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
  },
  groupTitleRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 5,
    marginBottom: 8
  },
  collapseGroupView: {
    position: 'absolute',
    right: 0,
  },
  groupActionsRenderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    alignItems: 'flex-end'
  },
  addNewReminderToGroupText: {
    marginBottom: 6,
    fontSize: 16,
    color: '#007aff',
    textAlign: 'center'
  },
  deleteGroupText: {
    marginBottom: 6,
    fontSize: 14,
    color: '#ff6861',
    textAlign: 'center'
  },
  groupPressableText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  reminderView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  reminderText: {
    fontSize: 20,
    marginBottom: 5
  },
  reminderTextStrikeThrough: {
    // textDecorationLine: 'line-through',
    // textDecorationStyle: 'solid'
    color: '#b5b5b5'
  },
  addNewReminderSelectedGroupPill: {
    position: 'absolute',
    top: -50,
    borderRadius: 100,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginTop: 5,
    backgroundColor: '#419dff'
  },
  addNewReminderSelectedGroupPillPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  addNewReminderInputView: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 10
  },
  newReminderInput: {
    height: 45,
    flex: 1,
    borderColor: 'gray',
    borderWidth: .8,
    borderRadius: 10,
    marginBottom: 25,
    paddingHorizontal: 10
  },
});

export default styles;
