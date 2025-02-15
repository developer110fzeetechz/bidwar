import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../helper/styles'
import { Badge } from 'react-native-paper'
import Test from '../components/Test'

import { useIsFocused } from '@react-navigation/native';
import { Redirect } from 'expo-router'
import { useAuth } from '../context/AuthContext'

export default function index() {
  const isFocused = useIsFocused();
  const { isLoggedIn } = useAuth()

  // return (
  //   <View style={globalStyles.container}>
  //     <Test isFocused={isFocused} />
  //   </View>
  // )
  return <Redirect href={isLoggedIn ? "(home)" : "(home)"} />
}

const styles = StyleSheet.create({

})