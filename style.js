import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  bigTitle: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  outterContainer: {
    flex: 1,
    marginTop: 50,
    marginHorizontal: 15,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  }
});

export default styles;
