import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../colors';

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  scroll: {
    width: '100%',
    marginTop: 20,
  },
  wrapper: {
    width: windowWidth - 40,
  },
  layout: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    flex: 1,
    width: windowWidth,
  },
  btn: {
    borderColor: 'black',
    borderRadius: 10,
    width: '100%',
    height: 64,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    marginLeft: 12,
  },
  input: {
    height: 44,
    borderBottomColor: colors.slate,
    borderBottomWidth: 1.5,
    marginBottom: 20,
    width: '100%',
  },
  payment: {
    backgroundColor: 'green',
    height: 50,
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
});

export default styles;
