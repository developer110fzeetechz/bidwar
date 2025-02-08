import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Snackbar, ActivityIndicator } from 'react-native-paper';
import useAxios from '../helper/useAxios';
import { router } from 'expo-router';
import { Dropdown } from 'react-native-paper-dropdown';

const UserForm = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [auctionData, setAuctionData] = useState([])
  const [RunningAuction, setRunningAuction] = useState('')
  const { fetchData, data, loading } = useAxios();

  const getAuctionLists = async () => {
    const res = await fetchData({
      url: '/api/auction',
      method: 'GET',
    })
    const resData = res.data.map((x) => {
      return {
        label: x.title,
        value: x._id,
      }
    })
    setAuctionData(resData)
  }
  useEffect(() => {
    getAuctionLists()
  }, [])

  const handleSubmit = async () => {
    if (!name || !phone || !email || !password || !RunningAuction) {
      setMessage('Please fill in all the required fields');
      setIsError(true);
      setVisible(true);
      return;
    }

    const userData = {
      name,
      phone,
      email,
      imageUrl,
      password,
      role: 'organisation',
      auctionId: RunningAuction
    };

    console.log(userData)
    try {
      const res = await fetchData({
        url: '/api/users',
        method: 'post',
        data: userData,
      });

      if (res?.status) {
        setMessage(res.message || 'User created successfully!');
        setIsError(false);
        setVisible(true);
        // Optionally clear the form after success
        setName('');
        setPhone('');
        setEmail('');
        setImageUrl('');
        setPassword('');
        setTimeout(() => {
          router.back();
        }, 1000);
      } else {
        throw new Error(res?.message || 'Failed to create user');
      }
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
      setVisible(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>User Registration</Text>

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        label="Phone"
        value={phone}
        onChangeText={setPhone}
        keyboardType="numeric"
        style={styles.input}
      />

      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Dropdown
        label="Auction Lists"
        placeholder="Select Auction List"
        options={auctionData}
        value={RunningAuction}
        onSelect={setRunningAuction}

      />
      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.submitButton}
      >
        {loading ? 'Submitting...' : 'Submit'}
      </Button>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={Snackbar.DURATION_SHORT}
        style={{ backgroundColor: isError ? 'red' : 'green' }}
      >
        {message}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  submitButton: {
    marginTop: 16,
  },
});

export default UserForm;
