import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router'
import ProfilePage from '../../components/Profile'
import { getUserDetails } from '../../helper/Storage'

export default function profile() {
  const user = getUserDetails()
  //     const router = useRouter()
  // const location = useLocalSearchParams()
  // const pathname = usePathname()
  // console.log(pathname)

  return (
    <>
      {
        (user.role == "admin" || user.role === "organisation") &&
        <ProfilePage user={user} />
      }
    </>
  )
}

const styles = StyleSheet.create({})