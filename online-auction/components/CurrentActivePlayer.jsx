import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, Card, List, Text, Divider, Badge } from 'react-native-paper';
import { baseUrl } from '../helper/useAxios';

export default function CurrentActivePlayer({ currentActivePlayer, currentBidder, currentBid }) {
  if (!currentActivePlayer) {
    return <Text style={styles.loadingText}>Loading Player Details...</Text>;
  }

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Player Details - Image + Info */}
        <View style={styles.profileContainer}>
          <Avatar.Image size={80} source={{ uri: `${baseUrl}${currentActivePlayer.image}` }} />
          <View style={styles.detailsContainer}>
            <Text style={styles.name}>{currentActivePlayer.name}</Text>
            <Text style={styles.role}>{currentActivePlayer.playerRole}</Text>
            <Badge style={styles.basePriceBadge}>₹{currentActivePlayer.basePrice}</Badge>
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Current Bid Info */}
        <View style={styles.bidInfo}>
          <Text style={styles.bidAmount}>₹{currentBid}</Text>
          <Text style={styles.bidder}>Bidder: {currentBidder}</Text>
        </View>

        <Divider style={styles.divider} />

        {/* Skills Info - Batting & Bowling */}
        <View style={styles.skillsContainer}>
          <List.Item
            title="Batting"
            description={`${currentActivePlayer.battingDetails.battingOrder}, ${currentActivePlayer.battingDetails.handedness}`}
            left={() => <List.Icon icon="cricket" />}
          />
          <List.Item
            title="Bowling"
            description={currentActivePlayer.bowlingDetails.bowlingStyle}
            left={() => <List.Icon icon="bowling" />}
          />
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 15,
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fff',
    elevation: 5, // Shadow for better look
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsContainer: {
    marginLeft: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 16,
    color: '#666',
  },
  basePriceBadge: {
    backgroundColor: '#007bff',
    color: '#fff',
    marginTop: 5,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  bidInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  bidAmount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007bff',
  },
  bidder: {
    fontSize: 14,
    color: '#444',
  },
  skillsContainer: {
    marginTop: 10,
  },
  divider: {
    marginVertical: 8,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
  },
});
