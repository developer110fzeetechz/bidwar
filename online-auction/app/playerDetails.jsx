import { StyleSheet, Text, View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { heightPerHeight, widthPerWidth } from '../helper/dimensions';
import { router, useLocalSearchParams } from 'expo-router';
import useAxios from '../helper/useAxios';
import { Avatar, Card, Title, Paragraph, Divider, List, DataTable, Badge, Chip } from "react-native-paper";

export default function PlayerDetails() {
  const { fetchData } = useAxios();
  const { playerId } = useLocalSearchParams();
  const [userDetails, setUserDetails] = useState();

  useEffect(() => {
    const getPlayer = async () => {
      const res = await fetchData({
        url: `/api/players/player/${playerId}`,
        method: 'GET',
      });
      if (res.status) {
        setUserDetails(res.data);
      }
    };
    getPlayer();
  }, [playerId]);

  const { player, bid } = userDetails ?? {};

  return (
    <TouchableWithoutFeedback onPress={() => router.back()}>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <ScrollView style={styles.container}>
              {/* Player Profile Card */}
              <Card style={styles.card}>
                <Card.Content style={styles.profileContent}>
                  <Avatar.Image source={{ uri: player?.imageUrl }} size={80} />
                  <View style={styles.info}>
                    <Title>{player?.name}</Title>
                    <Paragraph style={styles.role}>{player?.playerType?.toUpperCase()}</Paragraph>
                    <Paragraph>Age: {player?.age}</Paragraph>
                  </View>
                </Card.Content>
              </Card>

              {/* Batting & Auction Details */}
              <Card style={styles.card}>
                <Card.Content>
                  <Title>Player Details</Title>
                  <Divider style={styles.divider} />
                  <List.Item title="Handedness" description={player?.battingDetails?.handedness} />
                  <List.Item title="Wicketkeeper" description={player?.battingDetails?.isWicketkeeper ? "Yes" : "No"} />
                  <List.Item title="Base Price" description={`$${player?.basePrice}`} />
                  <List.Item title="Sold To" description={bid?.status === "sold" ? bid.bids[bid.bids.length - 1].bidderName : "Not Sold"} />
                  <List.Item title="Final Price" description={bid?.status === "sold" ? `$${bid.bids[bid.bids.length - 1].bidAmount}` : "-"} />
                </Card.Content>
              </Card>

              {/* Bidding History Table */}
              {bid && (
                <Card style={styles.card}>
                  <Card.Content>
                    <Title>Bidding History</Title>
                    <Divider style={styles.divider} />
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title>Bidder</DataTable.Title>
                        <DataTable.Title numeric>Amount</DataTable.Title>
                        <DataTable.Title>Status</DataTable.Title>
                      </DataTable.Header>
                      {bid.bids.map((b, index) => (
                        <DataTable.Row key={b._id}>
                          <DataTable.Cell style={{ flex: 2 }}>
                            <Text style={{ flexShrink: 1 }}>{b.bidderName}</Text>
                          </DataTable.Cell>
                          <DataTable.Cell numeric style={{ flex: 1 }}>
                          <Chip >{b.bidAmount}</Chip>
                          </DataTable.Cell>
                          <DataTable.Cell style={{ flex: 1 , flexDirection:"row", gap:20, justifyContent:"center", alignItems:"center" }}>
                            {index === bid.bids.length - 1 ? <Badge style={styles.soldBadge}>SOLD</Badge> : "-"}
                          </DataTable.Cell>
                        </DataTable.Row>
                      ))}
                    </DataTable>
                  </Card.Content>
                </Card>
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: heightPerHeight(80),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  container: {
    width: widthPerWidth(100),
    backgroundColor: "#f8f9fa",
    padding: 10,
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
    elevation: 4,
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  info: {
    marginLeft: 15,
  },
  role: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  divider: {
    marginVertical: 8,
  },
  soldBadge: {
    backgroundColor: "green",
    color: "white",
    marginBottom:10
  },
});
