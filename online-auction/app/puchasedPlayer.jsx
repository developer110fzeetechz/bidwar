import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, SectionList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useAxios from '../helper/useAxios';
import { Appbar } from 'react-native-paper';
import { router } from 'expo-router';

export default function PurchasedPlayer() {
  const { fetchData, loading } = useAxios();
  const [players, setPlayers] = useState([]);

  const getData = async () => {
    try {
      const res = await fetchData({
        url: '/api/users/getPurchasedPlayer',
        method: 'GET',
      });
      if (res.status) {
        setPlayers(res.data); // Set the players in state
      } else {
        console.error('Error fetching data:', res?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('API error:', error.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  const categorizedPlayers = {
    batter: players.filter(player => player.playerDetails.playerType === 'batter'),
    bowler: players.filter(player => player.playerDetails.playerType === 'bowler'),
    allrounder: players.filter(player => player.playerDetails.playerType === 'allrounder'),
  };

  const sections = [
    { title: '🏏 Batters', data: categorizedPlayers.batter },
    { title: '🎯 Bowlers', data: categorizedPlayers.bowler },
    { title: '🔄 Allrounders', data: categorizedPlayers.allrounder },
  ];
  const _goBack = () => {
    router.back()
  }
  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Purchased Player" />

      </Appbar.Header>
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Fetching data...</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => index.toString()}
          renderSectionHeader={({ section: { title } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{title}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.playerCard} onPress={() => router.push(`playerDetails?playerId=${item.playerDetails._id}`)}>
              {/* User Image */}
              {JSON.stringify(item)}
              <Image
                source={{
                  uri: item.playerDetails.imageUrl || 'https://via.placeholder.com/100',
                }}
                style={styles.playerImage}
              />
              {/* Player Info */}
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{item.playerDetails.name}</Text>
                <Text style={styles.playerDetails}>Age: {item.playerDetails.age}</Text>
                <Text style={styles.playerDetails}>Email: {item.playerDetails.email}</Text>
                {/* Highlighted Price */}
                <Text style={styles.playerPrice}>Price: ₹{item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.noDataText}>No players purchased yet.</Text>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4CAF50',
    marginBottom: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
  sectionHeader: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  playerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  playerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#F0F0F0',
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
  },
  playerDetails: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  playerPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F', // Highlight price in red
    marginTop: 4,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 20,
  },
});
