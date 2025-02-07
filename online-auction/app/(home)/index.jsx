import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import Dashboard from '../../components/Dashboard'

import { useAuth } from '../../context/AuthContext'
import useAxios from '../../helper/useAxios'
import { Appbar, Avatar } from 'react-native-paper'
import { getUserDetails, isAdmin } from '../../helper/Storage'
import { useSocket } from '../../context/socketContext'
import { Dropdown } from 'react-native-paper-dropdown'
import { useData } from '../../context/useData'
import { widthPerWidth } from '../../helper/dimensions'

// import * as Device from 'expo-device';
export default function home() {
  const [dashboard, setDashboard] = useState({})
  const { fetchData } = useAxios()
  const { socket, isConnected } = useSocket();
  const{selectedAuction,setSelectedAuction,auctionData,setAuctionData ,}=useData()
  const {userRole, mydetails}=useAuth()
  const[myAuctionList,setMyAuctionList]=useState([])

  const getAllData = async () => {
    const { status, data } = await fetchData({
      url: `/api/dashboard?auctionId=${selectedAuction}`,
      method: "GET"
    })
    if (status) {
      setDashboard(data)
    }
  }

  useEffect(() => {
    getAllData()
  }, [selectedAuction])

 useEffect(()=>{
console.log(auctionData)
if(userRole==="organisation"){

  const auctionId = JSON.parse(mydetails).auctionId

  const filteredData= auctionData.filter((x)=>x.value===auctionId)
  setMyAuctionList(filteredData)
  console.log({filteredData})
}
if(userRole==="admin"){
  setMyAuctionList(auctionData)

}
 },[userRole, mydetails ,auctionData])
  
  const user = getUserDetails()
 
  useEffect(() => {
    if (socket && isConnected) {

      socket.emit('go:online', { ...user, socketId: socket.id })

      return () => {

      }
    }
  }, [socket, isConnected])

  return (
    <View style={styles.container}>
  
      <Appbar.Header style={{
        justifyContent:"space-between", paddingLeft:20
      }}>
        {/* <Appbar.BackAction onPress={_goBack} /> */}
       <View style={{
        width:widthPerWidth(70)
       }}>
       <Dropdown
                label="Select Events"
                placeholder="Select Events"
                options={myAuctionList || []}
                value={selectedAuction}
                onSelect={setSelectedAuction}
            /> 
       </View>

      
        <Avatar.Image
          size={45}
          source={{ uri: user.imageUrl || "https://www.esri.com/content/dam/esrisites/en-us/user-research-testing/assets/user-research-testing-overview-banner-fg.png" }}
          style={{ marginRight: 10, borderWidth: 3, borderColor: `${isConnected ? "green":"red"}` }}


        />
      </Appbar.Header>
<View>
  <Text>{userRole}</Text>
</View>
      <Dashboard dashboard={dashboard} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
paddingTop:10
  }
})