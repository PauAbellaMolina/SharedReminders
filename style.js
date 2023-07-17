import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
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
  item: {
    marginBottom: 8
  },
  itemText: {
    fontSize: 20,
  },
  itemTextStrikeThrough: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid'
  },
  itemTextDeleted: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    color: 'red'
  }
});

export default styles;
