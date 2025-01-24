import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

import Dashboard from '../../components/Dashboard'

import { useAuth } from '../../context/AuthContext'
import useAxios from '../../helper/useAxios'
import { Appbar, Avatar } from 'react-native-paper'
import { getUserDetails } from '../../helper/Storage'
import { useSocket } from '../../context/socketContext'
export default function home() {
  const [dashboard, setDashboard] = useState({})
  const { fetchData } = useAxios()
  const { socket, isConnected } = useSocket();

  const getAllData = async () => {
    const { status, data } = await fetchData({
      url: "/api/dashboard",
      method: "GET"
    })
    if (status) {
      setDashboard(data)
    }
  }

  useEffect(() => {
    getAllData()
  }, [])


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
      <Text style={{
        marginTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
      }}>{JSON.stringify(isConnected)}</Text>
      <Appbar.Header>
        {/* <Appbar.BackAction onPress={_goBack} /> */}
        <Appbar.Content title={user.name} titleStyle={{
          fontSize: 18,
          fontWeight: 'bold',
        }} />
        <Avatar.Image
          size={45}
          source={{ uri: user.imageUrl || "https://www.esri.com/content/dam/esrisites/en-us/user-research-testing/assets/user-research-testing-overview-banner-fg.png" }}
          style={{ marginRight: 10, borderWidth: 3, borderColor: `${isConnected ? "green":"red"}` }}


        />
      </Appbar.Header>

      <Dashboard dashboard={dashboard} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  }
})