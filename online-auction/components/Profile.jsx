import React from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Avatar, Paragraph, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

const ProfilePage = (props) => {
    const { user } = props
    const {logout}=useAuth()
    return (
        <ImageBackground
            source={{ uri: 'https://example.com/background-image.jpg' }}
            style={styles.background}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}  
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={styles.header}>
                    <Avatar.Image size={120} source={{ uri: 'https://example.com/team-logo.png' }} />
                    <Text style={styles.franchiseName}>Team {user.name}</Text>
                    <Paragraph style={styles.description}>
                        The best cricket franchise with top-tier players and incredible performance!
                    </Paragraph>
                </View>

                {/* User Information */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.cardTitle}>User Information</Text>
                        <View style={styles.infoContainer}>
                            <MaterialCommunityIcons name="account" size={20} color="gray" />
                            <Paragraph style={styles.infoText}>{user.name}</Paragraph>
                        </View>
                        <View style={styles.infoContainer}>
                            <MaterialCommunityIcons name="email" size={20} color="gray" />
                            <Paragraph style={styles.infoText}>{user.email}</Paragraph>
                        </View>
                    </Card.Content>
                </Card>

                {/* Team Stats */}
                <View style={styles.statsContainer}>
                    <Card style={styles.statCard}>
                        <Card.Content style={styles.statCardContent}>
                            <MaterialCommunityIcons name="trophy" size={30} color="#f5a623" />
                            <Text style={styles.statTitle}>Wins</Text>
                            <Text style={styles.statValue}>50</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.statCard}>
                        <Card.Content style={styles.statCardContent}>
                            <MaterialCommunityIcons name="close-circle" size={30} color="red" />
                            <Text style={styles.statTitle}>Losses</Text>
                            <Text style={styles.statValue}>20</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.statCard}>
                        <Card.Content style={styles.statCardContent}>
                            <MaterialCommunityIcons name="star" size={30} color="gold" />
                            <Text style={styles.statTitle}>Ranking</Text>
                            <Text style={styles.statValue}>1st</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Team Details */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.cardTitle}>Team Members</Text>
                        <Paragraph style={styles.infoText}>Player 1, Player 2, Player 3...</Paragraph>
                    </Card.Content>
                </Card>   
                   <Card style={styles.card}>
                    <Card.Content>
                     <TouchableOpacity onPress={()=>router.push('puchasedPlayer')}>
                     <Text style={styles.cardTitle}>Purchased player</Text>
                     <Paragraph style={styles.infoText}>Player 1, Player 2, Player 3...</Paragraph>
                     </TouchableOpacity>
                    </Card.Content>
                </Card>

                {/* Edit Profile and Logout Buttons */}
                <Button
                    mode="contained"
                    style={styles.button}
                    icon="account-edit"
                    onPress={() => alert('Edit Profile')}
                >
                    Edit Profile
                </Button>
                <Button
                    mode="outlined"
                    style={styles.button}
                    icon="logout"
                    onPress={() => 
                    [logout()]}
                >
                    Logout
                </Button>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 30, // Add padding at the bottom for proper spacing
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 50, // Added marginTop for top spacing
    },
    franchiseName: {
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#333',
    },
    description: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginTop: 8,
    },
    card: {
        marginBottom: 16,
        borderRadius: 10,
        elevation: 4,
        backgroundColor: '#fff',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    infoText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statCard: {
        flex: 1,
        margin: 4,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        elevation: 3,
    },
    statCardContent: {
        alignItems: 'center',
        padding: 12,
    },
    statTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#333',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 4,
        color: '#333',
    },
    button: {
        marginTop: 12,
        borderRadius: 50,
    },
});

export default ProfilePage;
