import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Divider, ActivityIndicator } from 'react-native-paper';
import { heightPerHeight } from '../helper/dimensions'; // Replace with your dimension helper or remove
import useAxios from '../helper/useAxios';
import { showToast } from '../helper/toasts';
import { Dropdown } from 'react-native-paper-dropdown';

export default function PlayerRegistration() {

    const OPTIONS = [
        { label: '1000', value: 1000 },
        { label: '1500', value: 1500 },
        { label: '2000', value: 2000 },
    ];
    const initalFormData = {
        name: '',
        age: '',
        phone: '',
        email: '',
        playerType: '', // Batter, Bowler, Allrounder
        batterDetails: {
            type: '', // Wicketkeeper or not
            hand: '', // Right-hand or Left-hand
        },
        bowlerDetails: {
            type: '', // Spin or Fast
            hand: '', // Right-arm or Left-arm
        },
        imageUrl: '',
        basePrice: 1000
    }
    const [formData, setFormData] = useState(initalFormData);
    const[auctionData,setAuctionData]=useState([])

    const [basePrice, setBasePrice] = useState(1000)
    const[RunningAuction,setRunningAuction]=useState('')
    const { fetchData, error, loading } = useAxios();
    const getAuctionLists = async ()=>{
const res =await fetchData({
    url: '/api/auction',
    method: 'GET',
})
const resData = res.data.map((x)=>{
    return{
        label:x.title,
        value:x._id,
    }
})
setAuctionData(resData)
    }

    useEffect(() => {
        getAuctionLists();
    }, []);

    useEffect(() => {
        if (error) {
            showToast(error);
        }
    }, [error]);

    const handleChange = (key, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleNestedChange = (key, subKey, value) => {
        setFormData((prev) => ({
            ...prev,
            [key]: {
                ...prev[key],
                [subKey]: value,
            },
        }));
    };

    const handleSubmit = async () => {
        const { name, age, phone, email, playerType, batterDetails, bowlerDetails, imageUrl } = formData;
        const dataToSubmit = {
            name,
            age,
            phone: Number(phone),
            email,
            playerType: playerType.toLowerCase(),
            imageUrl,
            basePrice:basePrice,
            auctionId:RunningAuction
        };

        if (playerType === 'Batter') {
            dataToSubmit.battingDetails = {
                handedness: batterDetails.hand.toLowerCase(),
                isWicketkeeper: batterDetails.type === 'Wicketkeeper',
            };
        }

        if (playerType === 'Bowler') {
            dataToSubmit.bowlingDetails = {
                arm: bowlerDetails.hand.toLowerCase(),
                type: bowlerDetails.type.toLowerCase(),
            };
        }

        const { data, message, status } = await fetchData({
            url: '/api/players',
            method: 'post',
            data: dataToSubmit,
        });

        if (status) {
            setFormData(initalFormData)
            setBasePrice(1000)
            showToast(message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Player Registration </Text>

            {/* Name */}
            <TextInput
                label="Name"
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                mode="outlined"
                style={styles.input}
            />

            {/* Age */}
            <TextInput
                label="Age"
                value={formData.age}
                onChangeText={(value) => handleChange('age', value)}
                mode="outlined"
                keyboardType="number-pad"
                style={styles.input}
            />

            {/* Phone */}
            <TextInput
                label="Phone"
                value={formData.phone}
                onChangeText={(value) => handleChange('phone', value)}
                mode="outlined"
                keyboardType="phone-pad"
                style={styles.input}
            />

            {/* Email */}
            <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                mode="outlined"
                keyboardType="email-address"
                style={styles.input}
            />

            {/* Player Type */}
            <Text style={styles.sectionHeader}>Player Type</Text>
            <RadioButton.Group
                onValueChange={(value) => handleChange('playerType', value)}
                value={formData.playerType}
            >
                <RadioButton.Item label="Batter" value="Batter" />
                <RadioButton.Item label="Bowler" value="Bowler" />
                <RadioButton.Item label="Allrounder" value="Allrounder" />
            </RadioButton.Group>

            {/* Conditional Fields for Batter */}
            {formData.playerType === 'Batter' && (
                <>
                    <Divider style={styles.divider} />
                    <Text style={styles.sectionHeader}>Batter Details</Text>
                    <RadioButton.Group
                        onValueChange={(value) => handleNestedChange('batterDetails', 'type', value)}
                        value={formData.batterDetails.type}
                    >
                        <RadioButton.Item label="Wicketkeeper" value="Wicketkeeper" />
                        <RadioButton.Item label="Non-Wicketkeeper" value="Non-Wicketkeeper" />
                    </RadioButton.Group>
                    <RadioButton.Group
                        onValueChange={(value) => handleNestedChange('batterDetails', 'hand', value)}
                        value={formData.batterDetails.hand}
                    >
                        <RadioButton.Item label="Right-hand" value="Right-hand" />
                        <RadioButton.Item label="Left-hand" value="Left-hand" />
                    </RadioButton.Group>
                </>
            )}

            {/* Conditional Fields for Bowler */}
            {formData.playerType === 'Bowler' && (
                <>
                    <Divider style={styles.divider} />
                    <Text style={styles.sectionHeader}>Bowler Details</Text>
                    <RadioButton.Group
                        onValueChange={(value) => handleNestedChange('bowlerDetails', 'type', value)}
                        value={formData.bowlerDetails.type}
                    >
                        <RadioButton.Item label="Spin" value="Spin" />
                        <RadioButton.Item label="Fast" value="Fast" />
                    </RadioButton.Group>
                    <RadioButton.Group
                        onValueChange={(value) => handleNestedChange('bowlerDetails', 'hand', value)}
                        value={formData.bowlerDetails.hand}
                    >
                        <RadioButton.Item label="Right-arm" value="Right-arm" />
                        <RadioButton.Item label="Left-arm" value="Left-arm" />
                    </RadioButton.Group>
                </>
            )}

            {/* Image URL */}
            <TextInput
                label="Image URL"
                value={formData.imageUrl}
                onChangeText={(value) => handleChange('imageUrl', value)}
                mode="outlined"
                style={styles.input}
            />
            <Dropdown
                label="Base Price"
                placeholder="Select Base Price"
                options={OPTIONS}
                value={basePrice}
                onSelect={setBasePrice}
            /> 
            <View style={{
                marginTop:10
            }}>
            <Dropdown
                label="Auction Lists"
                placeholder="Select Auction List"
                options={auctionData}
                value={RunningAuction}
                onSelect={setRunningAuction}
              
            />
            </View>
            {/* Submit Button */}
            <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
            >
                {loading ? <ActivityIndicator color="#fff" /> : 'Submit'}


            </Button>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexGrow: 1,
        paddingTop: heightPerHeight(10),
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        marginBottom: 15,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    divider: {
        marginVertical: 10,
    },
    submitButton: {
        marginTop: 20,
    },
});
