

import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSocket } from '../context/socketContext'
import { showToast } from '../helper/toasts'
import { heightPerHeight, widthPerWidth } from '../helper/dimensions'
import { Avatar, Button, Card, Chip, Title, Snackbar, Paragraph, Icon } from 'react-native-paper'

import { ProgressBar } from 'react-native-paper';
import MyDialog, { MyDialogNotify } from './Dialog'
import CustomSnackbar from './CustomSnackbar'
import { router } from 'expo-router'


export default function BidWar({ auctionDetails }) {
  const { mydetails, userRole } = useAuth();
  const user = JSON.parse(mydetails)
  const { socket } = useSocket();
  const [isStarted, setIsStarted] = useState(false);
  const [currentActivePlayer, setCurrentActivePlayer] = useState(null);
  const [timer, setTimer] = useState(60);  // Default timer set to 60 seconds
  const [progress, setProgress] = useState(1);  // Initial progress (full)
  const [currentBid, setCurrentBid] = useState(null)
  const [nextBid, setNextBid] = useState(null);
  const [currentBidder, setCurentBidder] = useState('')
  const [bidsHistory, setBidHistory] = useState([])

  // -----------------------dialog--------------------------
  const [visible, setVisible] = React.useState(false);
  const [visibleModal, setVisibleModal] = React.useState(false);
  const [snackBarContent, setSnackBarContent] = useState('fg')
  const [noitfyDetails, setNotifyDetails] = useState(null)


  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);


  const handleCurrentPlayer = useCallback((data) => {
    setNotifyDetails(null)
    setVisibleModal(false)
    if (!data.data) setCurrentActivePlayer(null)
    // console.log('Current Player:', data);
    const bids = data.data.battleground.bids
    if (bids.length) {
      const lastObj = bids[bids.length - 1]
      console.log({ lastObj })
      setNextBid(lastObj.nextBidAmount)
      setCurrentBid(lastObj.bidAmount)
      setCurentBidder(lastObj.bidderName)
      setBidHistory(bids.reverse())
    } else {
      setCurrentBid(data.data.player.basePrice)
      setBidHistory([])
      setNextBid(null)
      setCurentBidder('')
    }

    setCurrentActivePlayer(data.data.player);  // Set the current player details
  }, []);

  const startAuction = () => {
    socket.emit('start:auctionTable', { started: true, roomId: auctionDetails.roomId, auctionId: auctionDetails._id });
    showToast('Auction Started');
    setIsStarted(true);
    // // Start the timer when auction begins
    // let countdown = 60; // Timer for 60 seconds
    // const timerInterval = setInterval(() => {
    //   countdown -= 1;
    //   setTimer(countdown);
    //   setProgress(countdown / 60);  // Update progress bar

    //   if (countdown <= 0) {
    //     clearInterval(timerInterval);  // Stop the timer
    //     setCurrentActivePlayer(null);  // Reset current active player
    //     showToast('Time expired! Showing current player.');
    //     // Optionally, display current player data if available
    //     socket.emit('get:currentPlayer', auctionDetails.roomId);
    //   }
    // }, 1000); // Update timer every second
  };
  // ----------------emit---------------------------
  const handleBid = () => {
    const payload = {
      playerId: currentActivePlayer._id,
      bidderName: user.name,
      bidderId: user._id,
      bidAmount: nextBid ? nextBid : currentBid,
      roomId: auctionDetails.roomId,
    }
    socket.emit('place:Bid', payload,);
  }

  const soldTo = () => {
    console.log({ currentBidder })
    if (!currentBidder) {
      showToast('No current player to sell to')
      socket.emit('unSold', {
        playerId: currentActivePlayer._id,
        roomId: auctionDetails.roomId,
        auctionId: auctionDetails._id
      });
      return  // If no current player, do nothing and return
    } else {
      socket.emit('soldTo', {
        playerId: currentActivePlayer._id,
        roomId: auctionDetails.roomId,
        auctionId: auctionDetails._id
      });
    }


  }

  const lastChance = () => {
    socket.emit('lastChance', {
      playerId: currentActivePlayer._id,
      roomId: auctionDetails.roomId,
      auctionId: auctionDetails._id
    });
  }

  const outOfRace = () => {
    socket.emit('outOfRace', {
      roomId: auctionDetails.roomId,
      auctionId: auctionDetails._id,
      userName: user.name,
      userId: user._id

    });
  }
  // ---------------------listen----------------------------------
  const getCurrentBid = useCallback((data) => {
    console.log('current Bid', data)
    const bids = data.bids
    setNextBid(bids[bids.length - 1].nextBidAmount)
    setCurrentBid(bids[bids.length - 1].bidAmount)
    setCurentBidder(bids[bids.length - 1].bidderName)
    setBidHistory(bids.reverse())
  }, [])

  const soldTofn = useCallback((data) => {
    console.log('Sold to', data)

    setVisibleModal(true)

  }, [])


  const lastChanceHanlder = useCallback((data) => {
    setNotifyDetails('Last Chance to Bid for this Player')
  }, [outOfRaceHandler])

  const outOfRaceHandler = useCallback((data) => {
    console.log(data)
    setNotifyDetails(`${data.userName} is out of race for this bid`)
  }, [])


  // ------------------removing noityDetails-----------------
  useEffect(() => {
    if (noitfyDetails) {
      const timer = setTimeout(() => {
        setNotifyDetails(null)
      }, 4000)
      return () => {
        clearTimeout(timer)

      }
    }
  }, [noitfyDetails]);

  useEffect(() => {
    if (socket) {
      socket.on('user:joined', (data) => {
        showToast(`${data.userId.name} Joined In Auction`);
      });
      socket.on('currentPlayer', handleCurrentPlayer);
      socket.on('currentBid', getCurrentBid);
      socket.on('soldTo', soldTofn);
      socket.on('unSold', (data) => {
        console.log({ unSold: data })
        setVisibleModal(true)
      });
      socket.on('lastChance', lastChanceHanlder);
      socket.on('outOfRace', outOfRaceHandler)



      return () => {
        socket.off('user:joined');
        socket.off('currentPlayer');
        socket.off('currentBid');
        socket.off('lastChance', lastChanceHanlder);
        socket.off('soldTo', soldTofn);
        socket.off('unSold');
        socket.off('outOfRace', outOfRaceHandler);

      };
    }
  }, [socket]);



  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {visibleModal && <MyDialog visible={visibleModal} setVisible={setVisibleModal} currentActivePlayer={currentActivePlayer} currentBid={currentBidder} bidsHistory={bidsHistory} />}
      <MyDialogNotify visible={visible} setVisible={setVisible} message={snackBarContent} />

      {
        isStarted ? (
          <View>
            <Card>
              <Card.Title title="Team summary" />
              <Button style={{width:150}} icon="baseball-bat" mode="contained" onPress={() => router.push('puchasedPlayer')}>
                Purchased 
              </Button>
              <>

              </>
            </Card>
            <Text style={{ fontSize: 18 }}>Time Left: {timer}s</Text>
            <ProgressBar progress={progress} color="#6200ee" style={{ marginTop: 10 }} />
            {currentActivePlayer ? (
              <Card style={{ marginBottom: 20 }}>
                <Card.Content >
                  <Card.Title
                    title={currentActivePlayer.name}
                    right={() => <Chip background={'red'}  >{currentActivePlayer?.basePrice}</Chip>}
                  />
                  <View style={{
                    flexDirection: "row", justifyContent: "space-between", alignItems: "center"
                  }}>
                    <View>

                      <Text style={{ marginTop: 10 }}>Name: {currentActivePlayer.name}</Text>
                      <Text style={{ marginTop: 5 }}>Age: {currentActivePlayer.age}</Text>
                      <Text style={{ marginTop: 5 }}>Email: {currentActivePlayer.email}</Text>
                      <Text style={{ marginTop: 5 }}>Phone: {currentActivePlayer.phone}</Text>
                      <Text style={{ marginTop: 5 }}>Player Type: {currentActivePlayer.playerType}</Text>
                    </View>
                    <Avatar.Image size={100} source={{
                      uri: 'https://canto-wp-media.s3.amazonaws.com/app/uploads/2019/09/19193320/image-url-15.jpg'
                    }} />
                  </View>
                  {nextBid && <Text style={styles.currentBid}>Current Bid :{currentBid}</Text>}
                  {currentBidder && <Text style={styles.currentBid}>Bidder :{currentBidder}</Text>}
                </Card.Content>
                {noitfyDetails && <View style={styles.notify}>
                  <Text>{noitfyDetails}</Text>
                </View>}
                <Button mode="contained" onPress={() => handleBid()} style={{ marginTop: 20, marginVertical: 10, marginHorizontal: 20 }}>
                  Make Bid
                </Button>
                <Button mode="contained" onPress={() => outOfRace()} style={{ marginTop: 20, marginVertical: 10, marginHorizontal: 20 }}>
                  Out Of Race
                </Button>
                <View style={{ gap: "5%", marginTop: 20, marginVertical: 10, marginHorizontal: 20, flexDirection: "row", width: "100%" }}>

                  <Button style={{ width: '42%' }} mode="contained" onPress={() => soldTo()} >
                    {
                      !currentBidder ? "Unsold.." : "Sold..."
                    }

                  </Button>
                  <Button style={{ width: '42%' }} mode="contained" onPress={() => lastChance()} >
                    Last Chance
                  </Button>
                </View>



                <Text style={styles.historyTitle}>Bids History:</Text>
                {bidsHistory.map((bid, index) => (
                  <Card key={index} style={styles.historyCard}>
                    <Card.Title
                      right={() => <Chip style={{ marginRight: 10 }}>{bid.bidAmount}</Chip>}
                      left={() => <Chip style={{ width: widthPerWidth(50), textAlign: "center" }}>{bid.bidderName}</Chip>}
                    />
                  </Card>
                ))}

              </Card>
            ) : (
              <Text>No active player yet.</Text>
            )}
          </View>
        ) : (
          <View style={styles.container}>
            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.title}>Auction Details</Title>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Title:</Text> {auctionDetails.title}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Description:</Text> {auctionDetails.description}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Auction Date:</Text> {new Date(auctionDetails.auctionDate).toLocaleDateString()}
                </Paragraph>
                <Paragraph style={styles.paragraph}>
                  <Text style={styles.label}>Status:</Text> {auctionDetails.status}
                </Paragraph>
              </Card.Content>
            </Card>

            <Text style={styles.noticeText}>Auction Not Started</Text>
            <Text style={styles.groundText}>You Are In Auction Ground</Text>

            {userRole === "admin" && (
              <Button mode="contained" onPress={startAuction} style={styles.button}>
                Let's Start
              </Button>
            )}
          </View>
        )
      }
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',

    height: heightPerHeight(100)
  },
  card: {
    marginBottom: 20,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6200ee',
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
  noticeText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 10,
    color: '#ff4444',
  },
  groundText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#6200ee',
  },
  notStarted: {
    height: heightPerHeight(100),

    justifyContent: 'center',
    alignItems: 'center'
  },
  currentBid: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
    textAlign: "center"
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 10,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: "center",
    marginTop: 20
  },
  historyCard: {
    marginTop: 5
  },
  notify: {
    backgroundColor: "yellow",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  }
})
