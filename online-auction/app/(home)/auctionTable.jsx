import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import NoStartedPage from '../../components/NostStarted'
import AuctionTableScreen from '../../components/BidWar'

export default function auctionTable() {
    const [started, setStarted] = useState(true)
    return (
        <View>{
            started ? (
                <>
                    <AuctionTableScreen/>
                </>) :
                <NoStartedPage />
        }
        </View>
    )
}

const styles = StyleSheet.create({})