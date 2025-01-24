import { View, Text, StyleSheet } from 'react-native';
import Login from '../../components/Login';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
    <Login/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
