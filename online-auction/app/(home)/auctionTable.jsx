import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import NoStartedPage from '../../components/NostStarted'
import AuctionTableScreen from '../../components/BidWar'
import { getUserDetails } from '../../helper/Storage'
import ListsAuctions from '../../components/ListsAuctions'
import { useAuth } from '../../context/AuthContext'

export default function auctionTable() {
    const [started, setStarted] = useState(false)
    const {userRole,mydetails}=useAuth()
     const [selectedInternalAuction, setselectedInternalAuction] = useState(null);
console.log('renderd')
console.log({userRole})
    return (
        <View>{
            started ? (
                <>
                    <AuctionTableScreen auctionDetails={selectedInternalAuction} />
                </>) :
                <>{
                    userRole === "admin" ? <>
                        <ListsAuctions setStarted={setStarted}  setselectedInternalAuction={setselectedInternalAuction} selectedInternalAuction={selectedInternalAuction}/>
                    </> : <>

                        <NoStartedPage setStarted={setStarted} selectedInternalAuction={selectedInternalAuction} setselectedInternalAuction={setselectedInternalAuction} />
                    </>
                }</>
        }
        </View>
    )
}

const styles = StyleSheet.create({})