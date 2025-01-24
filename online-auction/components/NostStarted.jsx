import React from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { Button, IconButton, Paragraph } from 'react-native-paper';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPerHeight } from '../helper/dimensions';

const NoStartedPage = ({ role, startAuction }) => {
  return (
    <View style={styles.container}>
      {/* Empty State Illustration */}
      <View style={styles.iconContainer}>
        <AntDesign name="infocirlce" size={60} color="orange" />
        {/* Optional: Custom Illustration can be added */}
      </View>

      {/* Main Text */}
      <Text style={styles.title}>Auction Not Started Yet</Text>
      <Paragraph style={styles.description}>
        will Start Soon  at 3:00 pm
      </Paragraph>

      {/* Action Button */}
      {role === 'admin' && <Button
        mode="contained"
        style={styles.button}
        icon="play-circle"
        onPress={startAuction}
      >
        Start Now
      </Button>}


      {/* Optional Retry or Help Icon */}
      <IconButton
        icon="help-circle"
        size={30}
        onPress={() => alert('Need help?')}
        style={styles.helpIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: heightPerHeight(95),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3f51b5',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  helpIcon: {
    marginTop: 20,
  },
});

export default NoStartedPage;
