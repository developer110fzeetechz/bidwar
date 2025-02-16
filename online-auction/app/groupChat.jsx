import { StyleSheet, View, FlatList } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, Appbar, Avatar, TextInput } from 'react-native-paper';
import { widthPerWidth } from '../helper/dimensions';
import { useSocket } from '../context/socketContext';
import { router } from 'expo-router';
import { getUserDetails } from '../helper/Storage';

const groupChat = () => {

    const {socket,isConnected} = useSocket()
  const [messages, setMessages] = useState([
  ]);

  const user=getUserDetails()
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef();

  const getMessges = useCallback((message) => {
    console.log('new message', message);
    setMessages((prevMessages) => [...prevMessages, message]);
  },[])

  useEffect(() => {
    if (!isConnected) {
      return;
    }
  
    socket.on('chat:message', getMessges);
    return () => {
        socket.off('chat:message', getMessges);
    }
  }, []);
  const names = ['John Doe', 'Jane Smith', 'Alice Brown', 'Bob Johnson', 'Charlie Lee'];
  const getRandomName = () => {
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  };
  const getNumber = ()=>{
    console.log()
    // console.log(Math.floor(Math.random()))
    return (Math.round(Math.random() * names.length))
}
  const sendMessage = () => {
    if(socket){
        const payload ={
            
                userId:user._id,
                text:newMessage,
                senderName: user.name,
                avatar: user.image,
                socketId:socket.id
              
        }
        socket.emit('chat:message', payload);
        setNewMessage('');
  
    }
   
    // if (newMessage.trim()) {

    //   setMessages([
    //     ...messages,
    //     {
    //       id: Date.now().toString(),
    //       text: newMessage,
    //       sender: 'You',
    //       avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    //       userType: 'sent',
    //     },
    //   ]);
     
    // }
  };


  // Auto scroll to the last message whenever the messages are updated
  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const _goBack=()=>[
    router.back()
  ]
  const isSender =(item)=>{
    return item.userId===user._id;
  }
  // Render each chat message as a bubble with the avatar
  const renderMessage = ({ item }) => (
    <View
      style={
        isSender(item)  ? styles.sentMessage : styles.receivedMessage
      }
    >  
      {!isSender(item) && (
        <Avatar.Image size={25} source={{ uri: item.avatar }} />
      )}
      <View style={styles.messageBubble}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
      {isSender(item) && (
        <Avatar.Image size={25} source={{ uri: item.avatar }} />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header mode='center-aligned'>
      <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Community" titleStyle={{
            fontSize:18,
            fontWeight:'700'
        }} />
      </Appbar.Header>

      {/* Chat messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => Math.random().toString()}
        style={styles.chatList}
        contentContainerStyle={styles.chatListContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Input area */}
      <View style={styles.inputContainer}>
        <TextInput
          mode="outlined"
          label="Enter your message"
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type something"
          multiline
          right={
            <TextInput.Icon
              icon="send"
              color={'#6200ee'}
              onPress={sendMessage}
            />
          }
          style={{ width: '100%' }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatList: {
    paddingTop: 10,
    paddingBottom: 100, // Room for input and send button
  },
  chatListContent: {
    paddingHorizontal: widthPerWidth(4),
  paddingBottom:70
  },
  sentMessage: {
    alignSelf: 'flex-end',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 5,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
  },
  messageBubble: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 15,
    maxWidth: '80%',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: widthPerWidth(3),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingBottom: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
    borderRadius: 20,
    padding: 10,
  },
  sendButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default groupChat;
