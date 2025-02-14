import { StyleSheet, View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { globalStyles } from '../helper/styles';
import { widthPerWidth } from '../helper/dimensions';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import useAxios from '../helper/useAxios';
import { showToast } from '../helper/toasts';
import useUserDetails from '../hooks/useUserDetails';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // For handling the loading state
  const [error, setError] = useState(''); // For displaying error message


  const { login, isLoggedIn } = useAuth();
  const { fetchData, error: apiError } = useAxios();
  const {getMe} =useUserDetails('from loagin')

  const handleSubmit = async () => {

    // Clear any previous errors
    setError('');

    // Simple validation for empty fields
    if (!email || !password) {
      setError('Please fill all fields.');
      return;
    }

    setLoading(true);

    // Simulate a login API call
    try {
      const res = await fetchData({
        url: '/api/users/login', // Replace with your login API endpoint
        method: 'POST',
        data: { email, password },

      })
      console.log('our res', res)
      if (res.status) {
        console.log(res.data.token)
        
        getMe(res.data.token)
        
        login(res.data.token, res.data.role);

      }

      showToast(res.message)

    } catch (error) {
      console.log(error)
      setLoading(false);
    }

    // setTimeout(() => {
    //   if (email === '9122038952' && password === '1234') {
    //     setLoading(false);
    //     router.replace('home');
    //   } else {
    //     setLoading(false);
    //     setError('Invalid email or password.');
    //   }
    // }, 2000);
  };

  useEffect(() => {
    if (apiError) {
      showToast(apiError)

    }
  }, [apiError])
  const navigateToPlayerRegistration = () => {
    router.push('playerRegistration'); // Change this to your player registration screen route
  };
  const navigateToTeam = () => {
    router.push('userRegister'); // Change this to your player registration screen route
  };

  return (
    <View style={[globalStyles.container, styles.form]}>
      {/* Login Section */}
      <Text style={styles.headerText}>Login as Team</Text>
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        mode="outlined"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        error={!!error}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        mode="outlined"
        style={styles.input}
        secureTextEntry={!showPassword}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        error={!!error}
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.button}
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#fff" /> : 'Login'}
      </Button>

      {/* Divider */}
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>

      {/* Register Section */}
      <Button
        mode="outlined"
        onPress={navigateToPlayerRegistration}
        style={styles.registerButton}
      >
        Register as Player
      </Button>
      <Button
        mode="outlined"
        onPress={navigateToTeam}
        style={[styles.registerButton, {
          marginTop: 10
        }]}
      >
        Register as Team
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    width: widthPerWidth(100),
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    marginBottom: 10,
    width: widthPerWidth(90),
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  button: {
    marginTop: 20,
    width: widthPerWidth(90),
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    width: widthPerWidth(90),
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  dividerText: {
    marginHorizontal: 10,
    color: '#555',
  },
  registerButton: {
    width: widthPerWidth(90),
  },
});
