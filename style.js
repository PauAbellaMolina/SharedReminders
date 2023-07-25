import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  devBorder: {
    borderWidth: 1,
    borderColor: 'red'
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#CED0CE',
    // marginBottom: 10
  },
  bigTitle: {
    fontSize: 32,
    fontWeight: 'bold'
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
    marginRight: 5
  },
  groupTitleRowActions: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10
  },
  groupPressable: {
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 10,
    width: 25
  },
  groupPressableText: {
    fontSize: 20,
    color: 'blue',
    textAlign: 'center'
  },
  // reminderView: { //not used, remove
  //   marginBottom: 4
  // },
  reminderText: {
    fontSize: 20,
    marginBottom: 5
  },
  reminderTextStrikeThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  addNewReminderView: {
    width: '100%',
    flexDirection: 'column'
  },
  addNewReminderSelectedGroupPill: {
    flexDirection: 'row',
    gap: 10,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 10,
  },
  addNewReminderInputView: {
    width: '100%',
    flexDirection: 'row',
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
