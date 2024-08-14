import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Alert, Button, TextInput, KeyboardAvoidingView, ScrollView, Platform, StyleSheet, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { auth, db } from '../firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Audio } from 'expo-av';
import { CommonActions } from '@react-navigation/native';
import { getFirestore, collection, where, getDocs, doc, setDoc, deleteDoc, query, getDoc } from "firebase/firestore";
import {
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    StyledButton,
    ButtonText,
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
    const formikRef = useRef();

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

    const handleHeadOfFamilyConfirmation = () => {
        setIsHeadOfFamily(true);
    };

    const fetchFamilies = async () => {
        try {
            const familyCollection = collection(db, "families");
            const familySnapshot = await getDocs(familyCollection);
            const familyList = familySnapshot.docs.map(doc => ({ label: doc.id, value: doc.id }));
            setFamilies(familyList);
            setPickerValue(''); // Reset picker value
            setPickerVisible(true); // Show picker modal
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
                    setPickerVisible(false); // Hide picker modal
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
                formikRef.current.resetForm();
            } else {
                Alert.alert("No Family", "You are not currently in a family.");
                setIsHeadOfFamily(false);
                setIsChoosingFamily(false);
                setSelectedFamily(null);
                formikRef.current.resetForm();
            }
        } catch (error) {
            console.error("Error resetting family: ", error);
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
                        <Text> </Text>
                        <Text> </Text>
                        <Text> </Text>
                        <Text> </Text>
                        <WelcomeContainer>
                            <StyledButton onPress={handleSignOut}>
                                <ButtonText>Logout</ButtonText>
                            </StyledButton>
                            <StyledButton onPress={handleResetFamily}>
                                <ButtonText>Reset Family/Form</ButtonText>
                            </StyledButton>
                            <Line />
                            <Button title={isPlaying ? "Mute Music" : "Unmute Music"} onPress={toggleSound} />
                            <PageTitle welcome={true}>Welcome Swamy</PageTitle>
                            <SubTitle welcome={true}>Swamy Saranam {userEmail}</SubTitle>
                            <SubTitle welcome={true}>
                                {familyName ? `You are part of the family: ${familyName}` : "You are not part of any family.\n Please answer questions below"}
                            </SubTitle>
                            {/* <Line /> */}
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
});

export default Welcome;
