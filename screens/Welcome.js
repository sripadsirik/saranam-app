import React, { useState, useEffect, useRef } from 'react';

import { View, Text, Alert, Button, TextInput, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { auth, db } from '../firebase';

import { signOut, deleteUser, onAuthStateChanged } from 'firebase/auth';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Audio } from 'expo-av';
import { CommonActions } from '@react-navigation/native';

import { getFirestore, collection, where, getDocs, doc, setDoc, deleteDoc, query, getDoc, updateDoc } from "firebase/firestore";

import { Icon } from 'react-native-elements';
import Modal from 'react-native-modal';

import {
    InnerContainer,
    PageTitle,
    SubTitle,
    StyledFormArea,
    Line,
    WelcomeContainer,
    Avatar,
    StyledContainer
} from './../components/stylesw';


const validationSchema = Yup.object().shape({
    fullName: Yup.string().min(2, 'Full Name must be at least 2 characters').max(100, 'Full Name must be at most 100 characters').required('Full Name is required'),
});

const Welcome = ({ navigation }) => {
    const sound = useRef(new Audio.Sound());
    const [isPlaying, setIsPlaying] = useState(true);
    const [userEmail, setUserEmail] = useState(null);
    const [familyName, setFamilyName] = useState(null);
    const [isHeadOfFamily, setIsHeadOfFamily] = useState(false);
    const [isChoosingFamily, setIsChoosingFamily] = useState(false);
    const [families, setFamilies] = useState([]);
    const [selectedFamily, setSelectedFamily] = useState(null);
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [pickerValue, setPickerValue] = useState('');
    const [isMatha, setIsMatha] = useState(false);
    const [showMathaForm, setShowMathaForm] = useState(true);
    const [hasSelectedMathaOption, setHasSelectedMathaOption] = useState(false);
    const formikRef = useRef();

    const [isModalVisible, setModalVisible] = useState(false); // State to control modal visibility

    const toggleSound = async () => {
        if (isPlaying) {
            await sound.current.stopAsync();
        } else {
            await sound.current.setPositionAsync(6000);
            await sound.current.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const loadSound = async () => {
            try {
                await sound.current.loadAsync(
                    require('../assets/saranam.mp3'),
                    { isLooping: true },
                );
                await sound.current.setPositionAsync(6000);
                if (isPlaying) {
                    await sound.current.playAsync();
                }
            } catch (error) {
                console.log(error);
            }
        };
        loadSound();

        return () => {
            sound.current.unloadAsync();
        };
    }, []);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {

            if (user) {
                const atIndex = user.email.indexOf('@');
                const extractedUsername = atIndex !== -1 ? user.email.slice(0, atIndex) : user.email;
                setUserEmail(extractedUsername);

                const familyQuery = query(
                    collection(db, "families"),
                    where("members", "array-contains", extractedUsername)
                );
                const familySnapshot = await getDocs(familyQuery);

                if (!familySnapshot.empty) {
                    const familyDoc = familySnapshot.docs[0];
                    setFamilyName(familyDoc.id);

                    // Check if the user is already confirmed as Matha
                    const familyData = familyDoc.data();
                    if (familyData.matha === extractedUsername) {
                        setIsMatha(true);
                        setHasSelectedMathaOption(true);
                        setShowMathaForm(false);  // Hide the Matha form since the user is already confirmed
                    }
                } else {
                    setFamilyName(null);
                }


                showMessage({
                    message: "User logged in",
                    description: `Welcome ${extractedUsername}`,
                    type: "success",
                    duration: 5000,
                });
            } else {
                setUserEmail(null);
            }
        });

        return unsubscribe;
    }, []);

    const handleSignOut = async () => {
        try {
            await signOut(auth);

            toggleSound();
            console.log('User signed out');
            Alert.alert('Logged out', 'User logged out successfully');
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [
                        { name: 'Login' },
                    ],
                })
            );
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Delete Account',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const user = auth.currentUser;
                            if (user) {
                                await deleteUser(user);
                                toggleSound(); // Stop the music if account is deleted
                                console.log('User account deleted');
                                Alert.alert('Account Deleted', 'Your account has been deleted successfully.');

                                navigation.dispatch(
                                    CommonActions.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    })
                                );
                            } else {
                                console.log('No user is signed in');
                            }
                        } catch (error) {
                            console.error('Error deleting user account:', error);
                            Alert.alert('Error', 'There was an issue deleting your account. Please try again later.');
                        }
                    },
                },
            ]
        );
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <StyledContainer>
                    <StatusBar style="dark" />
                    <InnerContainer>
                        <TouchableOpacity
                            style={{ 
                                position: 'absolute', 
                                top: 50, 
                                right: 10, 
                                zIndex: 10, // Ensure the touchable is on top
                                backgroundColor: 'transparent', // Makes sure the touchable area is clear
                                padding: 5 // Adds padding to make it easier to tap
                            }}
                            onPress={() => setModalVisible(true)}
                        >
                            <Icon name="settings" size={30} color="#000" />
                        </TouchableOpacity>

                        <Modal
                            isVisible={isModalVisible}
                            onBackdropPress={() => setModalVisible(false)} // Close modal on backdrop press
                            style={{ justifyContent: 'flex-end', margin: 0 }} // Position at bottom
                        >
                            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                                <TouchableOpacity onPress={handleSignOut} style={{ padding: 10 }}>
                                    <Text>Logout</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleDeleteAccount} style={{ padding: 10 }}>
                                    <Text>Delete Account</Text>
                                </TouchableOpacity>
                                <Button title="Close" onPress={() => setModalVisible(false)} />
                            </View>
                        </Modal>

                        <Text> </Text>
                        <Text> </Text>
                        <Text> </Text>
                        <Text> </Text>
                        <WelcomeContainer>
                            
                            <Line />
                            <Button title={isPlaying ? "Mute Music" : "Unmute Music"} onPress={toggleSound} />
                            <PageTitle welcome={true}>Welcome Swamy</PageTitle>
                            <SubTitle welcome={true}>Swamy Saranam {userEmail}</SubTitle>
                            
                            <StyledFormArea>
                                <Avatar resizeMode="cover" source={require('../assets/img1.webp')} />
                                <Line />
                                
                            </StyledFormArea>
                        </WelcomeContainer>
                        <Text> </Text>
                        <Text> </Text>
                        <Text> </Text>
                        <Text> </Text>
                    </InnerContainer>
                </StyledContainer>
            </ScrollView>
            
            <FlashMessage position="top" />
        </KeyboardAvoidingView>
    );
};




export default Welcome;
