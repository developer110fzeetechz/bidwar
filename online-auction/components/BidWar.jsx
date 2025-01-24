import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Avatar, Paragraph, IconButton, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUserDetails } from '../helper/Storage';
import { useSocket } from '../context/socketContext';
import NoStartedPage from './NostStarted';

const AuctionTableScreen = () => {
  const user = getUserDetails();
  const { socket } = useSocket()
  const [isAuctionStarted, setIsAuctionStarted] = React.useState(false);
  const [currentPlayer, setCurrentPlayer] = React.useState(null);
  const [currentBid, setCurrentBid] = React.useState(0);
  const [nextBid, setNextBid] = useState(null)
  const [disableButton, setDisableButton] = useState(false)
  const [currentBidderName, setCurrentBidderName] = useState(null)
  const [outofRaceData, setOutofRaceData] = useState(false)
  const [biddingControl, setBiddingControl] = useState(false)
  // Sample player data
  const playerData = {
    name: "John Doe",
    role: "Batsman",
    type: "Wicketkeeper",
    basePrice: 500000,
    currentBid: 600000,
    image: 'https://example.com/player-image.jpg', // Player image URL
    description: "John is an aggressive batsman with great wicketkeeping skills. He has a track record of quick centuries and is a valuable asset to any team."
  };


  const startAuction = () => {
    socket.emit('start:auction', {
      start: true
    });
  }

  const handleSoldTo = useCallback((data) => {
    console.log("soldTo", data)
    Alert.alert("Sold To", `${data.bidder} for ${data.bidAmount}`)
    setBiddingControl(false)
    // setOutofRaceData(data)
  }, [])

  useEffect(() => {
    socket.on('start:auction', (data) => {
      setIsAuctionStarted(true)
    });
    socket.on('currentPlayer', (data) => {
      setCurrentPlayer(data)
      setCurrentBid(data.basePrice)
      setBiddingControl(true)
    })
    socket.on('currentBid', (data) => {
      const nextBid = data.bids[data.bids.length - 1].nextBidAmount
      const currentBid = data.bids[data.bids.length - 1].bidAmount
      const bidderId = data.bids[data.bids.length - 1].bidderId
      const bidderName = data.bids[data.bids.length - 1].bidderName
      setCurrentBidderName(bidderName)
      if (bidderId == user._id) {
        setDisableButton(true)
      } else {
        setDisableButton(false)
      }
      setCurrentBid(currentBid)
      setNextBid(nextBid)
    })
    socket.on('outofRace', handleOutOfRace)
    socket.on('soldTo', handleSoldTo);
    return () => {
      socket.off('start:auction');
      socket.off('currentPlayer');
      socket.off('currentBid');
      socket.off('outofRace', handleOutOfRace);
      socket.off('soldTo', handleSoldTo);
    }
  }, [])



  const handleOutOfRace = useCallback((data) => {
    console.log("outOfRace", data)
    setOutofRaceData(data)
  }, [])

  const handleBid = () => {
    const payload = {
      playerId: currentPlayer._id,
      bidderName: user.name,
      bidderId: user._id,
      bidAmount: nextBid ? nextBid : currentBid
    }
    socket.emit('currentBid', payload)
    // setDisableButton(true)
  }

  const outOfRace = () => {
    socket.emit('outofRace', {
      playerId: currentPlayer._id,
      bidderId: user._id,
      bidderName: user.name
    });
  }

  const SoldTo = () => {
    socket.emit('soldTo', {
      playerId: currentPlayer._id,
    });
  }
  return (
    <View style={styles.container}>

      {
        isAuctionStarted ? <ScrollView contentContainerStyle={styles.scrollContainer}>

          {outofRaceData &&
            <Chip icon="information" onPress={() => console.log('Pressed')}>{outofRaceData.bidderName} Out Of Race</Chip>
          }
          {/* Player Details Section */}
          <Card style={styles.playerCard}>
            <Card.Content>
              <View style={styles.playerInfoContainer}>
                {/* Player Image */}
                <Avatar.Image size={120} source={{ uri: currentPlayer?.imageUrl }} />
                <View style={styles.playerDetails}>
                  <Text style={styles.playerName}>{currentPlayer?.name}</Text>
                  {
                    currentPlayer?.playerType == "batter" && <>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <MaterialCommunityIcons name="cricket" size={24} color="black" />
                        <Text>{currentPlayer?.battingDetails?.handedness}</Text>
                      </View>
                      <Text>{currentPlayer?.battingDetails?.isWicketkeeper && "Wicket Keeper"}</Text>
                    </>
                  }
                  <Text style={styles.playerRole}>

                  </Text>
                  <Text style={styles.basePrice}>Base Price: {currentPlayer?.basePrice || 1000}</Text>
                  {
                    currentBid && <Text style={styles.currentBid}>Current Bid: ${currentBid}</Text>
                  }
                  {
                    currentBid && <Text style={styles.currentBid}>Bidder: {currentBidderName}</Text>
                  }

                  <Text style={styles.description}>{playerData.description}</Text>
                </View>
              </View>

              {/* Bid Section */}
              {biddingControl && <>

                <Button mode="contained" style={styles.bidButton} onPress={handleBid} disabled={disableButton}>
                  Place Bid {nextBid ? nextBid : currentBid}
                </Button>
                <Button mode="text" style={styles.bidButton} onPress={outOfRace} disabled={disableButton}>
                  Out of Race
                </Button>
                <Button mode="text" style={styles.bidButton} onPress={SoldTo} >
                  Sold
                </Button>
              </>}
            </Card.Content>

          </Card>

          {/* Auction History Section (Optional) */}
          <Card style={styles.historyCard}>
            <Card.Content>
              <Text style={styles.historyTitle}>Auction History</Text>
              <Paragraph style={styles.historyText}>Previous Bidder: Team A - $550,000</Paragraph>
              <Paragraph style={styles.historyText}>Previous Bidder: Team B - $600,000</Paragraph>
            </Card.Content>
          </Card>
        </ScrollView> :
          <NoStartedPage role={user.role} startAuction={startAuction} />
      }

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
    paddingTop: 50
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  teamSummaryContainer: {
    position: 'absolute',
    top: 30,
    right: 16,
    zIndex: 1,
    width: 240,
    elevation: 6,
  },
  summaryCard: {
    borderRadius: 12,
    backgroundColor: '#1a73e8', // Team-related color or blue
    padding: 16,
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 6,
  },
  playerCard: {
    marginTop: 130, // Space for the summary card
    borderRadius: 12,
    elevation: 6,
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
  },
  playerInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  playerDetails: {
    marginLeft: 16,
    flex: 1,
  },
  playerName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  playerRole: {
    fontSize: 16,
    color: '#555',
    marginTop: 6,
  },
  basePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  currentBid: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f5a623', // Current bid color
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  bidButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: '#28a745', // Green for action
  },
  historyCard: {
    marginTop: 20,
    borderRadius: 12,
    elevation: 6,
    backgroundColor: '#fff',
    padding: 16,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  historyText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
});

export default AuctionTableScreen;
