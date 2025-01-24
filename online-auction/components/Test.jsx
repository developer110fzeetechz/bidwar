import React, { useEffect } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { globalStyles } from '../helper/styles';
import { useNavigation } from 'expo-router';
import { useMMKVBoolean } from 'react-native-mmkv';

export default function Index({isFocused}) {
  const fadeAnim = new Animated.Value(0); // Initial opacity is 0
const [isLoggedIn,setIsLoggedIn] = useMMKVBoolean('isLoggedIn')
  const navigation = useNavigation()
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Target opacity is 1
      duration: 2000, // Duration in milliseconds
      useNativeDriver: true,
    }).start();
  }, [isFocused]);


  return (
    <View style={globalStyles.container}>
      <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
        <Text variant="headlineLarge" style={styles.welcomeText}>
          Welcome to Player Auction!
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("auth")}
          style={styles.button}
        >
          Get Started
        </Button>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  welcomeText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
});
