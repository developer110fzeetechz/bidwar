import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router'
import ProfilePage from '../../components/Profile'
import { getUserDetails } from '../../helper/Storage'
import { useAuth } from '../../context/AuthContext'
import PlayerProfile from '../../components/PlayerProfile'

export default function profile() {
  const user = getUserDetails()
  const {userRole}=useAuth()
  //     const router = useRouter()
  // const location = useLocalSearchParams()
  // const pathname = usePathname()
  // console.log(pathname)

  return (
    <>
      {
        (userRole == "admin" || userRole === "organisation" ) ?  <ProfilePage user={user} />:
        userRole==="player" ?<>
          <PlayerProfile/>
        </>
        :<></>
      }
    </>
  )
}

const styles = StyleSheet.create({})