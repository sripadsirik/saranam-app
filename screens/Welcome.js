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

    const handleHeadOfFamilyConfirmation = () => {
        setIsHeadOfFamily(true);
    };

    const handleMathaConfirmation = async () => {
        try {
            if (familyName) {
                const familyDocRef = doc(db, "families", familyName);
                const familyDoc = await getDoc(familyDocRef);
                
                if (familyDoc.exists()) {
                    await setDoc(familyDocRef, {
                        matha: userEmail
                    }, { merge: true });
    
                    setIsMatha(true);
                    setShowMathaForm(false);
                    setHasSelectedMathaOption(true);
                    Alert.alert("Matha Confirmed", "You are confirmed as Matha of the family!");
                } else {
                    Alert.alert("Error", "Family document does not exist.");
                }
            } else {
                Alert.alert("Error", "No family found to update.");
            }
        } catch (error) {
            console.error("Error updating family document: ", error);
            Alert.alert("Error", "There was an error updating the family document. Please try again.");
        }
    };
    
    const fetchFamilies = async () => {
        try {
            const familyCollection = collection(db, "families");
            const familySnapshot = await getDocs(familyCollection);
            const familyList = familySnapshot.docs.map(doc => ({ label: doc.id, value: doc.id }));
            setFamilies(familyList);
            setPickerValue('');
            setPickerVisible(true);
        } catch (error) {
            console.error("Error fetching families: ", error);
            Alert.alert("Error", "There was an error fetching families. Please try again.");
        }
    };

    const handleCreateFamily = async (values) => {
        try {
            const familyName = values.fullName.trim();
            if (familyName === "") {
                Alert.alert("Invalid Name", "Please enter a valid full name.");
                return;
            }

            const familyDocRef = doc(collection(db, "families"), familyName);
            await setDoc(familyDocRef, {
                head: userEmail,
                members: [userEmail],
            });

            Alert.alert("Family Created", `Family created successfully under the name: ${familyName}`);
            setFamilyName(familyName);
            setIsHeadOfFamily(false);
            setIsChoosingFamily(false);
        } catch (error) {
            console.error("Error creating family: ", error);
            Alert.alert("Error", "There was an error creating the family. Please try again.");
        }
    };

    const handleJoinFamily = async () => {
        try {
            if (pickerValue) {
                const familyDocRef = doc(db, "families", pickerValue);
                const familyDoc = await getDoc(familyDocRef);

                if (familyDoc.exists()) {
                    const familyData = familyDoc.data();
                    const members = familyData.members || [];
                    members.push(userEmail);

                    await setDoc(familyDocRef, {
                        ...familyData,
                        members: members
                    }, { merge: true });

                    Alert.alert("Family Joined", `Successfully joined the family: ${pickerValue}`);
                    setFamilyName(pickerValue);
                    setPickerVisible(false);
                } else {
                    Alert.alert("Error", "Family does not exist.");
                }
            }
        } catch (error) {
            console.error("Error joining family: ", error);
            Alert.alert("Error", "There was an error joining the family. Please try again.");
        }
    };

    const handleResetFamily = async () => {
        try {
            if (familyName) {
                const familyDocRef = doc(db, "families", familyName);
                await deleteDoc(familyDocRef);
    
                Alert.alert("Family Reset", `Family '${familyName}' has been deleted.`);
                setFamilyName(null);
                setIsHeadOfFamily(false);
                setIsChoosingFamily(false);
                setSelectedFamily(null);
                setIsMatha(false);
                setShowMathaForm(true);
                setHasSelectedMathaOption(false);
                if (formikRef.current) {
                    formikRef.current.resetForm();
                }
            } else {
                Alert.alert("No Family", "You are not currently in a family.");
                setIsHeadOfFamily(false);
                setIsChoosingFamily(false);
                setSelectedFamily(null);
                setIsMatha(false);
                setShowMathaForm(true);
                setHasSelectedMathaOption(false);
                if (formikRef.current) {
                    formikRef.current.resetForm();
                }
            }
        } catch (error) {
            console.error("Error resetting family: ", error);
        }
    };

    const handleNoMatha = () => {
        setShowMathaForm(false);
        setHasSelectedMathaOption(true);  // Mark that a selection has been made
    };

    const handleChangeMathaConfirmation = async () => {
        try {
            if (familyName) {
                const familyDocRef = doc(db, "families", familyName);
                await updateDoc(familyDocRef, {
                    matha: null
                });

                setIsMatha(false);
                setShowMathaForm(true);
                setHasSelectedMathaOption(false);
            } else {
                Alert.alert("Error", "No family found to update.");
            }
        } catch (error) {
            console.error("Error removing Matha field: ", error);
            Alert.alert("Error", "There was an error removing the Matha field. Please try again.");
        }
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
                            <StyledButton onPress={handleResetFamily}>
                                <ButtonText>Reset Family/Form</ButtonText>
                            </StyledButton>
                            {hasSelectedMathaOption && (
                                <StyledButton onPress={handleChangeMathaConfirmation}>
                                    <ButtonText>Change Matha Confirmation</ButtonText>
                                </StyledButton>
                            )}
                            <Line />
                            <Button title={isPlaying ? "Mute Music" : "Unmute Music"} onPress={toggleSound} />
                            <PageTitle welcome={true}>Welcome Swamy</PageTitle>
                            <SubTitle welcome={true}>Swamy Saranam {userEmail}</SubTitle>
                            <SubTitle welcome={true}>
                                {familyName ? `You are part of the family: ${familyName}` : "You are not part of any family.\n Please answer questions below"}
                            </SubTitle>
                            <StyledFormArea>
                                <Avatar resizeMode="cover" source={require('../assets/img1.webp')} />
                                <Line />
                                {!familyName && !isHeadOfFamily && (
                                    <View>
                                        <Text>Are you the head Swami of the family?</Text>
                                        <Button title="Yes" onPress={handleHeadOfFamilyConfirmation} />
                                        <Text> </Text>
                                        <Button title="No" onPress={fetchFamilies} />
                                    </View>
                                )}
                                {isHeadOfFamily && !familyName && (
                                    <Formik
                                        innerRef={formikRef}
                                        initialValues={{ fullName: '' }}
                                        validationSchema={validationSchema}
                                        onSubmit={handleCreateFamily}
                                    >
                                        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                            <View>
                                                <TextInput
                                                    placeholder="Family Name"
                                                    onChangeText={handleChange('fullName')}
                                                    onBlur={handleBlur('fullName')}
                                                    value={values.fullName}
                                                    style={styles.input}
                                                />
                                                {errors.fullName && touched.fullName && (
                                                    <Text style={styles.errorText}>{errors.fullName}</Text>
                                                )}
                                                <StyledButton onPress={handleSubmit}>
                                                    <ButtonText>Create Family</ButtonText>
                                                </StyledButton>
                                            </View>
                                        )}
                                    </Formik>
                                )}

                                {/* Matha Confirmation */}
                                {familyName && !isMatha && showMathaForm && (
                                    <View>
                                        <Text>Are you a Matha of the family?</Text>
                                        <Button title="Yes" onPress={() => {
                                            handleMathaConfirmation();
                                            setHasSelectedMathaOption(true);  // Mark that a selection has been made
                                        }} />
                                        <Button title="No" onPress={handleNoMatha} />
                                    </View>
                                )}

                                {isMatha && (
                                    <>
                                        <Text>You are confirmed as Matha of the family!</Text>
                                        <StyledButton onPress={() => navigation.navigate("MathaTabs")}>
                                            <ButtonText>Go to Matha Screens to Select Food</ButtonText>
                                        </StyledButton>
                                    </>
                                )}
                            </StyledFormArea>
                        </WelcomeContainer>
                        <Text> </Text>
                        <Text> </Text>
                        <Text> </Text>
                        <Text> </Text>
                    </InnerContainer>
                </StyledContainer>
            </ScrollView>
            <Modal
                visible={isPickerVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setPickerVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Select a Family</Text>
                        <Picker
                            selectedValue={pickerValue}
                            onValueChange={(itemValue) => setPickerValue(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a family" value="" />
                            {families.map(family => (
                                <Picker.Item key={family.value} label={family.label} value={family.value} />
                            ))}
                        </Picker>
                        <Button title="Join Family" onPress={handleJoinFamily} />
                        <Text> </Text>
                        <Button title="Cancel" onPress={() => setPickerVisible(false)} />
                    </View>
                </View>
            </Modal>
            <FlashMessage position="top" />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 4
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    picker: {
        height: 200,
        width: '100%',
    },
    redButton: {
        backgroundColor: 'red',
    },
});


export default Welcome;
