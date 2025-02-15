import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Avatar, Card, List, Text, Divider, IconButton } from 'react-native-paper';
import { getUserDetails } from '../helper/Storage';
import useAxios, { baseUrl } from '../helper/useAxios';
import { router, useLocalSearchParams } from 'expo-router';
import { heightPerHeight } from '../helper/dimensions';


export default function PlayerDetails({ route, navigation }) {
  const [playerDetails, setPlayerDetails] = useState(null);
  const [bidDetails, setBidDetails] = useState(null);
  const { playerId } = useLocalSearchParams();
  const { fetchData } = useAxios();

  useEffect(() => {
    const getPlayer = async () => {
      const res = await fetchData({
        url: `/api/players/player/${playerId}`,
        method: 'GET',
      });
      if (res.status) {
        setPlayerDetails(res.data.player);
        setBidDetails(res.data.bid);
      }
    };
    getPlayer();
  }, [playerId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Close Button */}
      <IconButton
        icon="close"
        size={24}
        style={styles.closeButton}
        onPress={() => router.back()}
      />

      {/* Profile Card */}
      <Card style={[styles.card, styles.primaryCard]}>
        <Card.Content>
          <View style={styles.avatarContainer}>
            <Avatar.Image size={100} source={{ uri: `${baseUrl}${playerDetails?.image}` }} />
            <Text style={styles.name}>{playerDetails?.name}</Text>
            <Text style={styles.role}>{playerDetails?.playerRole}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Personal Information Card */}
      <Card style={styles.card}>
        <Card.Content>
          <List.Section>
            <List.Item title="Age" description={playerDetails?.age} left={() => <List.Icon icon="calendar" />} />
            <List.Item title="Email" description={playerDetails?.email} left={() => <List.Icon icon="email" />} />
            <List.Item title="Phone" description={playerDetails?.phone} left={() => <List.Icon icon="phone" />} />
          </List.Section>
        </Card.Content>
      </Card>

      {/* Batting Details Card */}
      <Card style={[styles.card, styles.secondaryCard]}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Batting Details</Text>
          <Divider style={styles.divider} />
          <List.Item title="Batting Order" description={playerDetails?.battingDetails?.battingOrder} left={() => <List.Icon icon="bat" />} />
          <List.Item title="Handedness" description={playerDetails?.battingDetails?.handedness} left={() => <List.Icon icon="hand" />} />
        </Card.Content>
      </Card>

      {/* Bowling Details Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Bowling Details</Text>
          <Divider style={styles.divider} />
          <List.Item title="Bowling Style" description={playerDetails?.bowlingDetails?.bowlingStyle} left={() => <List.Icon icon="cricket" />} />
        </Card.Content>
      </Card>

      {/* Additional Info Card */}
      <Card style={[styles.card, styles.highlightCard]}>
        <Card.Content>
          <List.Item title="Wicketkeeper" description={playerDetails?.isWicketkeeper === "yes" ? "Yes" : "No"} left={() => <List.Icon icon="account-check" />} />
          <List.Item title="Base Price" description={`₹${playerDetails?.basePrice}`} left={() => <List.Icon icon="currency-inr" />} />
        </Card.Content>
      </Card>

      {/* Auction Details Card */}
      {bidDetails && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Auction Details</Text>
            <Divider style={styles.divider} />
            <List.Item title="Auction Status" description={bidDetails?.status} left={() => <List.Icon icon="gavel" />} />
            {bidDetails.status === "sold" && (
              <List.Item title="Sold To" description={bidDetails.bids?.[bidDetails.bids.length - 1]?.bidderName} left={() => <List.Icon icon="account" />} />
            )}
            <Text style={styles.sectionTitle}>Bid History</Text>
            <Divider style={styles.divider} />
            {bidDetails.status === "sold" ? (
              bidDetails.bids?.map((bid, index) => (
                <List.Item
                  key={bid._id}
                  title={`Bid ${index + 1}: ₹${bid.bidAmount}`}
                  description={`Bidder: ${bid.bidderName} ${index === bidDetails.bids.length - 1 ? '(Sold)' : ''}`}
                  left={() => <List.Icon icon="cash" />}
                  style={{ backgroundColor: `rgba(76, 175, 80, ${0.1 + index * 0.1})`, padding: 10, borderRadius: 5, marginBottom: 5 }}
                />
              ))
            ) : (
              <Text style={styles.errorText}>No bids available.</Text>
            )}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical:10,
    backgroundColor: '#e6e6e6',
    flexGrow: 1,
    marginTop:heightPerHeight(20),
    borderTopEndRadius:30,
    borderTopStartRadius:30,
    paddingBottom:heightPerHeight(20)
  },
  closeButton: {
    // position: 'absolute',
    // top: 10,
    // right: 5,
    zIndex: 10,
    backgroundColor:'rgba(0, 0, 0, 0.2)"',
    alignSelf:"flex-end",
    marginBottom:10
  },
  card: {
    borderRadius: 10,
    paddingVertical: 15,
    marginBottom: 15,
  },
  primaryCard: {
    backgroundColor: '#E3F2FD',
  },
  secondaryCard: {
    backgroundColor: '#FFECB3',
  },
  highlightCard: {
    backgroundColor: '#C8E6C9',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  role: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  divider: {
    marginVertical: 8,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
