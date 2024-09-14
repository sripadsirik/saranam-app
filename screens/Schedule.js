import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Modal, Button, View } from 'react-native'; // Make sure Modal, Button, and View are imported
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, where, getDocs, deleteDoc, addDoc, query, doc } from "firebase/firestore";
import { auth, analytics } from '../firebase.js';
import { onSnapshot } from "firebase/firestore";

import {
    StyledContainer,
    InnerContainer,
    PageTitle,
    StyledFormArea,
    LeftIcon, 
    StyledInputLabel,
    StyledTextInput,
    StyledButton,
    ButtonText,
    Line,
    Colors
} from './../components/styleschedule';

const { brand, darkLight } = Colors;

const Schedule = ({ navigation }) => {
    const db = getFirestore();
    const user = auth.currentUser;
    
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [show, setShow] = useState(false);
    const [date, setDate] = useState(new Date());
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [pickerValue, setPickerValue] = useState('');
    const [familyName, setFamilyName] = useState(null); // New state for family name
    const [hasFamilyBooking, setHasFamilyBooking] = useState(false);


    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "families"), where("members", "array-contains", user.email)),
            (snapshot) => {
                if (!snapshot.empty) {
                    const familyDoc = snapshot.docs[0];
                    setFamilyName(familyDoc.id);
                } else {
                    setFamilyName(null);
                }
            },
            (error) => console.error("Error fetching family data:", error)
        );

        return () => unsubscribe(); // Clean up listener when component unmounts
    }, [user.email]);

    // Fetch any existing booking for the family in real time
    useEffect(() => {
        if (familyName) {
            const unsubscribe = onSnapshot(
                query(collection(db, "appointments"), where("familyName", "==", familyName)),
                (snapshot) => {
                    if (!snapshot.empty) {
                        setHasFamilyBooking(true); // Family already has a booking
                    } else {
                        setHasFamilyBooking(false); // Family doesn't have a booking
                    }
                }
            );
            return () => unsubscribe(); // Clean up the listener
        }
    }, [familyName]);


    

    const showDatePicker = () => {
        setDatePickerVisibility(true);
        setShow(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
        setShow(false);
    };

    const handleConfirm = (handleChange, selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = `${selectedDate.getFullYear()}-${('0' + (selectedDate.getMonth() + 1)).slice(-2)}-${('0' + selectedDate.getDate()).slice(-2)}`;
            handleChange('Day')(formattedDate);
        }
        hideDatePicker();
    };

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle> Schedule </PageTitle>

                    <Formik
                        initialValues={{ fullName: '', name: '', phoneNumber: '', Day: '', address: '' }}
                        onSubmit={async (values) => {
                            if (!familyName) {
                                Alert.alert('Error', 'No family selected. Please select a family before scheduling.');
                                return;
                            }
                            if (!values.fullName || values.fullName.length < 2 || values.fullName.length > 100) {
                                Alert.alert('Error', 'Full Name must be between 2 and 100 characters');
                            } else if (!values.name || !['Abhishekam', 'Beeksha'].includes(values.name)) {
                                Alert.alert('Error', 'Invalid selection for type of pooja Abhishekam/Beeksha');
                            } else if (!values.phoneNumber || !/^[0-9]{10}$/.test(values.phoneNumber)) {
                                Alert.alert('Error', 'Phone Number must be exactly 10 digits');
                            } else if (!values.Day) {
                                Alert.alert('Error', 'Day is required, other than the current day or past day');
                            } else if (new Date(values.Day).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                                Alert.alert('Error', 'You cannot select a date before the current date');
                            } else if (!values.address || values.address.length < 2 || values.address.length > 100) {
                                Alert.alert('Error', 'Address must be between 2 and 100 characters');
                            } else {
                                const dateParts = values.Day.split("-");
                                const utcDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], 12, 0, 0));                             

                                const appointmentData = {
                                    fullName: values.fullName,
                                    name: values.name,
                                    phoneNumber: Number(values.phoneNumber),
                                    Day: utcDate,
                                    address: values.address,
                                    familyName: familyName, // Add family name to the data sent to Firestore
                                    userId: user.uid,
                                };

                                const dateQuery = query(
                                    collection(db, "appointments"),
                                    where("Day", "==", utcDate)
                                );
                                const dateSnapshot = await getDocs(dateQuery);
                                if (!dateSnapshot.empty) {
                                    Alert.alert('Error', 'An arrangement with this date already exists.');
                                    return;
                                }

                                const phoneQuery = query(
                                    collection(db, "appointments"),
                                    where("phoneNumber", "==", appointmentData.phoneNumber)
                                );
                                const phoneSnapshot = await getDocs(phoneQuery);
                                if (!phoneSnapshot.empty) {
                                    Alert.alert('Error', 'An arrangement with this phone number already exists.');
                                    return;
                                }

                                const userAppointmentQuery = query(
                                    collection(db, "appointments"),
                                    where("userId", "==", user.uid)
                                );
                                const userAppointmentSnapshot = await getDocs(userAppointmentQuery);

                                if (!userAppointmentSnapshot.empty) {
                                    const docId = userAppointmentSnapshot.docs[0].id;
                                    await deleteDoc(doc(db, 'appointments', docId));
                                    Alert.alert('Tip', 'Your previous arrangement has been deleted.');
                                }
                                if (!familyName) {
                                    Alert.alert('Error', 'No family selected. Please select a family before scheduling.');
                                    return;
                                }
                        
                                if (hasFamilyBooking) {
                                    Alert.alert('Error', 'This family already has a booking.');
                                    return;
                                }

                                try {
                                    const docRef = await addDoc(collection(db, "appointments"), appointmentData);
                                    Alert.alert('Success', 'Your appointment has been scheduled.');
                                    navigation.navigate('Bookings');
                                } catch (e) {
                                    console.error("Error adding document: ", e);
                                }
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Full Name"
                                    icon="person"
                                    placeholder="Pawan Kalyan"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('fullName')}
                                    onBlur={handleBlur('fullName')}
                                    value={values.fullName}
                                />

                                {/* Family Name (non-editable) */}
                                <MyTextInput
                                    label="Family Name"
                                    icon="home"
                                    placeholder="No family selected"
                                    placeholderTextColor={darkLight}
                                    value={familyName ? familyName : 'No family selected'}
                                    editable={false}
                                />

                                <MyTextInput
                                    label="Abhishekam or Beeksha"
                                    icon="home"
                                    placeholder="Abhishekam/Beeksha"
                                    placeholderTextColor={darkLight}
                                    onBlur={handleBlur('name')}
                                    value={name}
                                    onFocus={() => setPickerVisible(true)}
                                />

                                <Modal
                                    animationType="slide"
                                    transparent={true}
                                    visible={isPickerVisible}
                                    onRequestClose={() => {
                                        setPickerVisible(!isPickerVisible);
                                    }}
                                >
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                                            <Picker
                                                style={{ width: 200 }}
                                                selectedValue={pickerValue}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    setPickerValue(itemValue);
                                                    setName(itemValue);
                                                    handleChange('name')(itemValue);
                                                    setPickerVisible(true);
                                                }}
                                            >
                                                <Picker.Item label="Select..." value="" />
                                                <Picker.Item label="Abhishekam" value="Abhishekam" />
                                                <Picker.Item label="Beeksha" value="Beeksha" />
                                            </Picker>

                                            <Button title="Close" onPress={() => setPickerVisible(!isPickerVisible)} />
                                        </View>
                                    </View>
                                </Modal>

                                <MyTextInput
                                    label="Phone Number (without +1)"
                                    icon="device-mobile"
                                    placeholder="1234567890"
                                    placeholderTextColor={darkLight}
                                    keyboardType="numeric"
                                    onChangeText={(text) => {
                                        setPhoneNumber(text);
                                        handleChange('phoneNumber')(text);
                                    }}
                                    onBlur={handleBlur('phoneNumber')}
                                    value={phoneNumber}
                                />

                                <DateTimePickerModal
                                    isVisible={isDatePickerVisible}
                                    mode="date"
                                    onConfirm={(selectedDate) => handleConfirm(handleChange, selectedDate)}
                                    onCancel={hideDatePicker}
                                />

                                <MyTextInput
                                    label="Selected Date"
                                    icon="calendar"
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={darkLight}
                                    value={date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}` : 'No date selected'}
                                    editable={true}
                                    onFocus={showDatePicker}
                                />

                                <MyTextInput
                                    label="Your Address"
                                    icon="note"
                                    placeholder="111 Drummer Rd"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('address')}
                                    onBlur={handleBlur('address')}
                                    value={values.address}
                                />

                                <StyledButton onPress={handleSubmit}>
                                    <ButtonText>Schedule</ButtonText>
                                </StyledButton>
                                <Line />
                            </StyledFormArea>
                        )}
                    </Formik>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                    <Text> </Text>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
    return (
        <TouchableOpacity activeOpacity={1} onPress={isDate ? showDatePicker : undefined} style={{ position: 'relative' }}>
            <View>
                <LeftIcon>
                    <Octicons name={icon} size={30} color={brand} />
                </LeftIcon>
                <StyledInputLabel>{label}</StyledInputLabel>
                <StyledTextInput {...props} pointerEvents={isDate ? 'none' : 'auto'} onChangeText={props.onChangeText} />
            </View>
        </TouchableOpacity>
    );
};

export default Schedule;
