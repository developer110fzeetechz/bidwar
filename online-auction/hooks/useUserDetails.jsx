
import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import useAxios from '../helper/useAxios'
import { useAuth } from '../context/AuthContext'
import { useMMKVString } from 'react-native-mmkv'

export default function useUserDetails() {
    const { fetchData } = useAxios()
    const { userToken } = useAuth()
    const [mydetails, setMyDetails] = useMMKVString('me');
    

    const getUserDetails = async () => {
        try {

            const {data,status} = await fetchData({
                url: '/api/users/profile',
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            if(status){
                setMyDetails(JSON.stringify(data))
            }

        } catch (error) {

        }
    }

    useEffect(() => {
        getUserDetails()
    }, [])


const userDetails=mydetails
    return {userDetails}
}

