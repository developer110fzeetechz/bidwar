import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TextInput } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator, AnimatedFAB, Modal, Button, Portal, Text } from 'react-native-paper';
import useAxios from '../helper/useAxios';
import Header from './Header';
import { heightPerHeight } from '../helper/dimensions';
import { useSocket } from '../context/socketContext';
import { useData } from '../context/useData';

export default function ListsAuctions({ animatedValue, visible, style, setStarted,selectedInternalAuction, setselectedInternalAuction }) {
    const { fetchData, loading } = useAxios();
    const [auctions, setAuctions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [formModalVisible, setFormModalVisible] = useState(false);
    const { isAuctionStarted, setIsAuctionStarted, selectedAuction } = useData()
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        auctionDate: '',
        status: 'Pending',
    });
   
    const { socket } = useSocket()

    useEffect(() => {
        const getData = async () => {
            const res = await fetchData({
                url: '/api/auction/allauction',
                method: 'GET',
            });
            if (res.status) {
                setAuctions(res.data);
            }
        };
        getData();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFormSubmit = async () => {
        const res = await fetchData({
            url: '/api/auction',
            method: 'POST',
            data: formData,
        });
        if (res.status) {
            setAuctions((prev) => [res.data, ...prev]);
            setFormData({
                title: '',
                description: '',
                auctionDate: '',
                status: 'Pending',
            });
            setFormModalVisible(false);
        } else {
            console.error('Error creating auction:', res.message);
        }
    };

    const handleStartAuction = (data) => {
        console.log({ selectedInternalAuction })
        setModalVisible(false);
        setStarted(true)
        socket.emit('start:auction', {
            start: true,
            roomId: selectedInternalAuction.roomId,
            auctionId: selectedInternalAuction._id,
        });
    };

    const renderAuctionItem = ({ item }) => (
        <Card style={styles.card} onPress={() => {
            setselectedInternalAuction(item);
            setModalVisible(true);
        }}>
            <Card.Content>
                <Title>{item.title}</Title>
                <Paragraph>{item.description}</Paragraph>
                <Paragraph>Status: {item.status}</Paragraph>
                <Paragraph>
                    Auction Date: {new Date(item.auctionDate).toLocaleDateString()}
                </Paragraph> <Paragraph>
                    Auction Date: {item.roomId}
                </Paragraph>
            </Card.Content>
        </Card>
    );

    return (
        <View style={styles.container}>
            <Header title={'Auction Lists'} />
            {loading ? (
                <ActivityIndicator animating={true} size="large" style={styles.loader} />
            ) : (
                <FlatList
                    data={auctions}
                    keyExtractor={(item) => item._id}
                    renderItem={renderAuctionItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
            <AnimatedFAB
                icon={'plus'}
                label={'Add Auction'}
                extended={false}
                onPress={() => setFormModalVisible(true)}
                visible={visible}
                animateFrom={'right'}
                iconMode={'static'}
                style={[styles.fabStyle, style]}
            />
            {/* Auction Details Modal */}
            <Portal>
                <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                    {selectedInternalAuction && (
                        <>
                            <Text style={styles.modalTitle}>{selectedInternalAuction.title}</Text>
                            <Paragraph>{selectedInternalAuction.description}</Paragraph>
                            <Paragraph>Status: {selectedInternalAuction.status}</Paragraph>
                            <Paragraph>
                                Auction Date: {new Date(selectedInternalAuction.auctionDate).toLocaleDateString()}
                            </Paragraph>
                            <Button mode="contained" onPress={handleStartAuction} style={styles.submitButton}>
                                Start Auction
                            </Button>
                        </>
                    )}
                </Modal>
            </Portal>
            {/* Add New Auction Form Modal */}
            <Portal>
                <Modal visible={formModalVisible} onDismiss={() => setFormModalVisible(false)} contentContainerStyle={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Add New Auction</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Title"
                        value={formData.title}
                        onChangeText={(value) => handleInputChange('title', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={formData.description}
                        onChangeText={(value) => handleInputChange('description', value)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Auction Date (YYYY-MM-DD)"
                        value={formData.auctionDate}
                        onChangeText={(value) => handleInputChange('auctionDate', value)}
                    />
                    <Button mode="contained" onPress={handleFormSubmit} style={styles.submitButton}>
                        Submit
                    </Button>
                </Modal>
            </Portal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        flexGrow: 1,
        height: heightPerHeight(100),
        paddingBottom: heightPerHeight(6),
    },
    card: {
        marginBottom: 10,
        borderRadius: 8,
    },
    loader: {
        marginTop: 20,
    },
    list: {
        paddingBottom: 20,
    },
    fabStyle: {
        bottom: heightPerHeight(12),
        right: 16,
        position: 'absolute',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        marginHorizontal: 20,
        borderRadius: 8,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
    },
    submitButton: {
        marginTop: 10,
    },
});
