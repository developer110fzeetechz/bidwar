import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, ToastAndroid } from 'react-native';
import { Button, IconButton, Paragraph } from 'react-native-paper';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { heightPerHeight, widthPerWidth } from '../helper/dimensions';
import { Dropdown } from 'react-native-paper-dropdown';
import { useData } from '../context/useData';
import { useSocket } from '../context/socketContext';
import Toast from 'react-native-toast-message';
import { getUserDetails } from '../helper/Storage';
import { useAuth } from '../context/AuthContext';

const NoStartedPage = ({ role, startAuction,setStarted }) => {
  const { selectedAuction, setSelectedAuction, auctionData } = useData()
  const [auctionList,setAuctionList]=useState([])
  console.log('NoStartedPage')
  const [selectOne, setselectOne] = useState('')
  const user = getUserDetails()
  const { socket } = useSocket()
  const {mydetails, userRole}=useAuth()

  useEffect(()=>{
    if(userRole==="organisation"){

      const auctionId = JSON.parse(mydetails).auctionId
    
      const filteredData= auctionData.filter((x)=>x.value===auctionId)
      setAuctionList(filteredData)

    }
  },[mydetails, userRole])
  const joinRoom = () => {
    if (!selectOne) {
      ToastAndroid.show('Please select Event!', ToastAndroid.SHORT);
      return 0;
    }
    socket.emit("join:room", {
      username: user.name,
      auctionId: selectOne,
      userId: user._id,
      
    })
    setStarted(true)
  }
  return (
    <View style={styles.container}>
      {/* Empty State Illustration */}
      <View style={styles.iconContainer}>
        <AntDesign name="infocirlce" size={60} color="orange" />
        {/* Optional: Custom Illustration can be added */}
      </View>

      {/* Main Text */}
      <Text style={styles.title}>Auction Not Started Yet</Text>
      <Text style={[styles.title, {
        fontSize: 16
      }]}>Select Auction </Text>
      <View style={{
        width: "100%"
      }}>
        <Dropdown
          label="Select Events"
          placeholder="Select Events"
          options={auctionList || []}
          value={selectOne}
          onSelect={(data) => {
            setselectOne(data)
          }}
        />
      </View>
      <Button style={{
        width: "90%",
        marginTop: 20
      }} mode="contained" onPress={() => joinRoom()}>
        Go Live for Auction
      </Button>



      {/* Optional Retry or Help Icon */}
      <IconButton
        icon="help-circle"
        size={30}
        onPress={() => alert('Need help?')}
        style={styles.helpIcon}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: heightPerHeight(95),
    width: widthPerWidth(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,

  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3f51b5',
    borderRadius: 50,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  helpIcon: {
    marginTop: 20,
  },
});

export default NoStartedPage;
