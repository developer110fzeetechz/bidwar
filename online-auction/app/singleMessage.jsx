import { StyleSheet, View, FlatList } from 'react-native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Text, Appbar, Avatar, TextInput } from 'react-native-paper';
import { widthPerWidth } from '../helper/dimensions';
import { useSocket } from '../context/socketContext';
import { router, useLocalSearchParams } from 'expo-router';
import { getUserDetails } from '../helper/Storage';

const PrivateChat = ({ route }) => {
    const { socket, isConnected } = useSocket();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef();

    const user = getUserDetails();
    const recipientId = "dasf", recipientName = "sdf", recipientAvatar = "sdf"
    //   const { recipientId, recipientName, recipientAvatar } = route.params; // Passed from the previous screen

    const { name, imageUrl, userId, socketId } = useLocalSearchParams()

    const getMessages = useCallback((message) => {
        console.log(message)
        setMessages((prevMessages) => [...prevMessages, message]);
        // if (message.senderId === recipientId || message.receiverId === user._id) {
        // }
    }, []);


    useEffect(() => {
        if (socket) {
            socket.emit('getPrivate:messages', {
                senderId: user._id,
                recieverId: userId,
            }); // Join the room with the recipient's ID

            socket.on('receivePrivate:messages', (messages) => {
                setMessages(messages);
            });
            return () => {
                socket.off('receivePrivate:messages', (messages) => {
                    setMessages(messages);
                });
            }
        }
    }, []);
    useEffect(() => {
        if (!isConnected) return;

        socket.on('private:message', getMessages);
        return () => {
            socket.off('private:message', getMessages);
        }
    }, [isConnected, getMessages]);

    const sendMessage = () => {
        if (!newMessage.trim()) return;

        const payload = {
            senderId: user._id,
            recieverId: userId,
            text: newMessage,
            senderName: user.name,
            senderAvatar: user.imageUrl,
            socketId: socketId,
        };

        socket.emit('private:message', payload); // Emit to the specific user
        setMessages((prevMessages) => [...prevMessages, payload]); // Add to local state
        setNewMessage('');
    };

    useEffect(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    const _goBack = () => {
        router.back();
    };

    const isSender = (item) => item.senderId === user._id;

    const renderMessage = ({ item }) => (
        <View
            style={isSender(item) ? styles.sentMessage : styles.receivedMessage}
        >

            <View style={styles.messageBubble}>
                <Text style={styles.messageText}>{item.text}</Text>
            </View>

        </View>
    );

    return (
        <View style={styles.container}>
            <Appbar.Header mode="center-aligned">
                <Appbar.BackAction onPress={_goBack} />
                <Appbar.Content
                    title={name}
                    titleStyle={{
                        fontSize: 18,
                        fontWeight: '700',
                    }}
                />
                <Avatar.Image size={30} source={{ uri: imageUrl }} />
            </Appbar.Header>
            {/* <Text>{JSON.stringify(messages)}</Text> */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.messageId || Math.random().toString()}
                style={styles.chatList}
                contentContainerStyle={styles.chatListContent}
                showsVerticalScrollIndicator={false}
            />

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
                            color="#6200ee"
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
        paddingBottom: 100,
    },
    chatListContent: {
        paddingHorizontal: widthPerWidth(4),
        paddingBottom: 70,
    },
    receivedMessage: {
        alignSelf: 'flex-end',
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 5,
    },
    sentMessage: {
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
});

export default PrivateChat;
