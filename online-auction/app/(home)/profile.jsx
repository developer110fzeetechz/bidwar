import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router'
import ProfilePage from '../../components/Profile'

export default function profile() {
//     const router = useRouter()
// const location = useLocalSearchParams()
// const pathname = usePathname()
// console.log(pathname)

  return (
    <>
 <ProfilePage/>
    </>
  )
}

const styles = StyleSheet.create({})