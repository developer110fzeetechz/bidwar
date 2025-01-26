import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { Card, Text, View, Button, Chip } from 'react-native-paper';

const BidHistory = ({ currentPlayer, bids }) => {
  // If no bids, show a message
  if (!bids || bids.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No bids placed yet!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>Auction History</Text>
          {/* Map over bids array to display bidAmount and bidderName */}
          {bids.map((bid, index) => (
            <Card key={index} style={styles.bidItem}>
              <Card.Content style={{
                flexDirection: 'row',
                justifyContent:'space-between',
              }}>
                <Text style={styles.bidderName}>{bid.bidderName}</Text>
                <Text style={styles.bidAmount}> ${bid.bidAmount}</Text>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
  },
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 6,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  bidItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  bidderName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bidAmount: {
    fontSize: 14,
    color: '#555',
  },
});

export default BidHistory;
