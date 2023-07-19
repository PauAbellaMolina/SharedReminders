import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#CED0CE'
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
  reminderView: {
    marginBottom: 5
  },
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
