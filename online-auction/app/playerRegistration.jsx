import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, RadioButton, Divider, ActivityIndicator, Avatar } from 'react-native-paper';
import { heightPerHeight } from '../helper/dimensions'; // Replace with your dimension helper or remove
import useAxios from '../helper/useAxios';
import { showToast } from '../helper/toasts';
import { Dropdown } from 'react-native-paper-dropdown';
import * as ImagePicker from 'expo-image-picker';


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
        password: "",
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
    const [auctionData, setAuctionData] = useState([])
    const [showpassword, setShowPassword] = useState(false)

    const [basePrice, setBasePrice] = useState(1000)
    const [RunningAuction, setRunningAuction] = useState('')
    const { fetchData, error, loading } = useAxios();
    const [image,setImage]=useState('')
    const getAuctionLists = async () => {
        const res = await fetchData({
            url: '/api/auction',
            method: 'GET',
        })
        const resData = res.data.map((x) => {
            return {
                label: x.title,
                value: x._id,
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

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          quality: 1,
        });
    
        if (!result.canceled) {
          console.log(result);
          const imag = result.assets[0].uri
          setImage(imag);
        } else {
          alert('You did not select any image.');
        }
      };

    const handleSubmit = async () => {
        const { name, age, phone, email, playerType, batterDetails, bowlerDetails, imageUrl } = formData;
        console.log(formData)
        const dataToSubmit = {
            name,
            age,
            phone: Number(phone),
            email,
            playerType: playerType.toLowerCase(),
            imageUrl,
            basePrice: basePrice,
            auctionId: RunningAuction
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
            <TouchableOpacity style={{
                alignSelf: "center",
                marginBottom: 20
            }}
            onPress={pickImageAsync}
            >
                <Avatar.Image size={100} source={{
                    uri:image||'https://images.unsplash.com/photo-1593766787879-e8c78e09cbbe?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                }} 

// onPress={()=>console.log('pressed')}

                />
            </TouchableOpacity>

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
            <TextInput
                label="Password"
                secureTextEntry={!showpassword}
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                right={<TextInput.Icon icon="eye" onPress={() => setShowPassword((pre) => !pre)} />}
            />

            {/* Player Type */}
            <Text style={styles.sectionHeader}>Player Roles</Text>

            <Dropdown
                label="Player Role ?"
                options={[
                    { label: "Batsman", value: 'Batsman' },
                    { label: "Bowler", value: 'Bowler' },
                    { label: "Allrounder", value: 'Allrounder' }
                ]}
                value={formData.playerType}
                onSelect={(value) => handleChange('playerType', value)}
            />


            <>
                <Divider style={styles.divider} />
                <Text style={styles.sectionHeader}>Batter Details</Text>
                <Dropdown
                    label="Batting Handendness"
                    options={[
                        { label: "Right Hand", value: 'Right-hand' },
                        { label: "Left Hand", value: 'Left-hand' }
                    ]}
                    value={formData.batterDetails.hand}
                    onSelect={(value) => handleNestedChange('batterDetails', 'hand', value)}
                />
                <Text style={styles.sectionHeader}>Is Wicketkeeper ?</Text>
                <Dropdown
                    label="IsWicketkeeper"
                    options={[
                        { label: "Yes", value: true },
                        { label: "No", value: false }
                    ]}
                    value={formData.batterDetails.isWicketKeeper}
                    onSelect={(value) => handleNestedChange('batterDetails', 'isWicketKeeper', value)}
                />
                <Text style={styles.sectionHeader}>Preferred Batting Order ?</Text>
                <Dropdown
                    label="Preferred Batting Order ?"
                    options={[
                        { label: "Middle Order", value: 'Middle Order' },
                        { label: "Top Order", value: 'Top Order' }
                    ]}
                    value={formData.batterDetails.battingOrder}
                    onSelect={(value) => handleNestedChange('batterDetails', 'battingOrder', value)}
                />

                <Text style={styles.sectionHeader}>Preferred Bowling Style ?</Text>
                <Dropdown
                    label="Preferred Bowling Style"
                    options={[
                        { label: "Right Arm Fast", value: 'Right Arm Fast' },
                        { label: "Right Arm Medium", value: 'Right Arm Medium' },
                        { label: "Left Arm Fast", value: 'Left Arm Fast' },
                        { label: "Left Arm Medium", value: 'Left Arm Medium' },
                        { label: "Left Arm Spinner", value: 'Left Arm Spinner' },
                        { label: "Right Arm Spinner", value: 'Right Arm Spinner' },
                    ]}
                    value={formData.bowlerDetails.bowlingStyle}
                    onSelect={(value) => handleNestedChange('bowlerDetails', 'bowlingStyle', value)}
                />
            </>


            {/* Image URL */}
            <Divider style={styles.divider} />
            <Dropdown
                label="Base Price"
                placeholder="Select Base Price"
                options={OPTIONS}
                value={basePrice}
                onSelect={setBasePrice}
            />
            
            <Divider style={styles.divider} />
                <Dropdown
                    label="Auction Lists"
                    placeholder="Select Auction List"
                    options={auctionData}
                    value={RunningAuction}
                    onSelect={setRunningAuction}

                />
   
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
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
    },
    divider: {
        marginVertical: 10,
    },
    submitButton: {
        marginTop: 20,
    },
});
