import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { Text, Button, Card, Avatar, Paragraph, IconButton, Chip, Dialog, Portal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getUserDetails } from '../helper/Storage';
import { useSocket } from '../context/socketContext';
import NoStartedPage from './NostStarted';
import BidStatus from './BidsHistory';
import BidHistory from './BidsHistory';

const AuctionTableScreen = () => {
  const user = getUserDetails();  // Fetch user details from storage
  const { socket } = useSocket()
  const [isAuctionStarted, setIsAuctionStarted] = React.useState(false);
  const [currentPlayer, setCurrentPlayer] = React.useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [nextBid, setNextBid] = useState(null)
  const [disableButton, setDisableButton] = useState(false)
  const [currentBidderName, setCurrentBidderName] = useState(null)
  const [outofRaceData, setOutofRaceData] = useState(false)
  const [biddingControl, setBiddingControl] = useState(false)
  const[showlastChances, setShowlastChances] = useState(false)
  const [bidHistory,setBidHistory] = useState([])

  // Sample player data (use real data from the server)
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
  }, [])

  const handleCurrentPlayer = useCallback((data) => {
    console.log('current player ', data)
    setCurrentPlayer(data)
    setCurrentBid(data.basePrice)
    setBiddingControl(true)
    setDisableButton(false)
    setCurrentBid(data.basePrice || 1000)
    setNextBid(null)
  }, [])

  useEffect(() => {
    socket.on('start:auction', (data) => {
      setIsAuctionStarted(true)
    });
    socket.on('currentPlayer', handleCurrentPlayer)

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
      setBidHistory(data.bids)
    })
    socket.on('outofRace', handleOutOfRace)
    socket.on('soldTo', handleSoldTo);
    socket.on('lastChance', (data) => {
      console.log("lastChance", data)
      setShowlastChances(true)
    })

    return () => {
      socket.off('start:auction');
      socket.off('currentPlayer', handleCurrentPlayer);
      socket.off('currentBid');
      socket.off('outofRace', handleOutOfRace);
      socket.off('soldTo', handleSoldTo);
      socket.off('lastChance');
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

  const lastChance = () => {
    socket.emit('lastChance', {});
  }

  const hideDialog = () => setShowlastChances(false);

  useEffect(() => {
    if (showlastChances) {
      const timer = setTimeout(hideDialog, 2000)
      return () => clearTimeout(timer);
    }
  }, [showlastChances])

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog visible={showlastChances} onDismiss={hideDialog}>
          <Dialog.Title>Last Chance</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">This is Your Last chance to bid for this player</Text>
            <Text variant="bodyMedium" >Any One Else Coming In ?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {
        isAuctionStarted ? <ScrollView contentContainerStyle={styles.scrollContainer}>

          {outofRaceData &&
            <Chip icon="information" onPress={() => console.log('Pressed')}>{outofRaceData.bidderName} Out Of Race</Chip>
          }

          {/* Player Details Section */}
          <Card style={styles.playerCard}>
            <View>
              {/* Only show this button if the user status is 'accepted' */}
              {user.status === 'accepted' && (
                <Button style={{ width: 160, alignSelf: 'flex-end' }} mode="contained" onPress={lastChance}>
                  Last chance
                </Button>
              )}
            </View>
            <Card.Content>
              <View style={styles.playerInfoContainer}>
                <Avatar.Image size={120} source={{ uri: currentPlayer?.imageUrl }} />
                <View style={styles.playerDetails}>
                  <Text style={styles.playerName}>{currentPlayer?.name}</Text>
                  <Text style={styles.basePrice}>Base Price: {currentPlayer?.basePrice || 1000}</Text>
                  {currentBid && <Text style={styles.currentBid}>Current Bid: ${currentBid}</Text>}
                  {currentBid && <Text style={styles.currentBid}>Bidder: {currentBidderName}</Text>}
                  <Text style={styles.description}>{playerData.description}</Text>
                </View>
              </View>

              {/* Bid Section: Only show buttons if the user status is 'accepted' */}
              {biddingControl && user.status === 'accepted' && <>
                <Button mode="contained" style={styles.bidButton} onPress={handleBid} disabled={disableButton}>
                  Place Bid {nextBid ? nextBid : currentBid}
                </Button>
                <Button mode="text" style={styles.bidButton} onPress={outOfRace} disabled={disableButton}>
                  Out of Race
                </Button>
                <Button mode="text" style={styles.bidButton} onPress={SoldTo}>
                  Sold
                </Button>
              </>}

            </Card.Content>
          </Card>

          {/* Auction History Section (Optional) */}
      {bidHistory.length &&    
            <BidHistory bids={bidHistory}/>
       }
        </ScrollView> :
          <NoStartedPage role={user.role} startAuction={startAuction} />
      }
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    paddingTop: 50
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  playerCard: {
    marginTop: 130,
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
  basePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  currentBid: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f5a623',
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
    backgroundColor: '#28a745',
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
