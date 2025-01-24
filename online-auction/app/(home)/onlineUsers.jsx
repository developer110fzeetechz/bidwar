import { StyleSheet, View, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Text, Card, Avatar } from 'react-native-paper'; // Import components from react-native-paper
import { useSocket } from '../../context/socketContext'
import { useIsFocused } from '@react-navigation/native';
import { heightPerHeight, widthPerWidth } from '../../helper/dimensions';
import FloatingButton from '../../components/FloatingButton';
import { router } from 'expo-router';

export default function OnlineUsers() {
  const { socket, isConnected } = useSocket();
  const isFocused = useIsFocused();
  const [allOnlineUsers, setAllOnlineUsers] = useState([]);

  useEffect(() => {
    if (socket && isFocused) {
      socket.emit('onlineUsers'); // Emit event to get online users

      // Listen for the online users response
      socket.on('onlineUsers', (users) => {

        setAllOnlineUsers(users); // Update state with users
      });

      // Clean up the socket listener when the component is unmounted or socket disconnects
      return () => {
        socket.off('onlineUsers');
      };
    }
  }, [isFocused, socket]);

  // Render each user item
  const renderItem = ({ item }) => (
    <Card style={styles.userCard} onPress={() => router.push(`singleMessage?userId=${item.userId}&imageUrl=${item.image}&name=${item.name}&socketId=${item.socketId}`)}>
      <View style={styles.cardContent}>
        <Avatar.Image size={50} source={{ uri: item.image }} style={styles.avatar} />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{item.name}</Text>
          {/* <Text style={styles.userName}>{item.socketId}</Text> */}
          <Text style={styles.userStatus}>
            {item.socketId ? 'Online' : 'Offline'}
          </Text>
        </View>
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>


      {/* Display the list of online users */}
      <FlatList
        data={allOnlineUsers}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={
          <Text style={styles.title}>Online Users</Text>
        }
      />
      <FloatingButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: heightPerHeight(5),
    paddingHorizontal: widthPerWidth(3)
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  connectionStatus: {
    marginBottom: 20,
    fontSize: 16,
    color: 'gray',
  },
  userCard: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3, // Paper shadow effect
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  avatar: {
    marginRight: 15,
  },
  textContainer: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
  },
  userStatus: {
    fontSize: 14,
    color: '#888',
    color: "green"
  },
});
