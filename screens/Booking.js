import { React, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, StatusBar } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome';
import { LinearGradient } from 'expo-linear-gradient';

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
    WelcomeImage,
    Avatar,
    StyledContainer
} from '../components/stylesw';
import { MsgBox, ItemBox } from '../components/styles';

const Booking = () => {
    const [appointments, setAppointments] = useState([]);
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            const q = query(collection(db, "appointments"), where("userId", "==", user.uid));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const appointments = [];
                querySnapshot.forEach((doc) => {
                    appointments.push(doc.data());
                });
                setAppointments(appointments);
            });

            // Clean up the onSnapshot listener when the component is unmounted
            return () => unsubscribe();
        }
    }, [user]);

    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle> My Pooja Time </PageTitle>
                    <Line />
                    <MsgBox> Only one booking is allowed. To schedule another (if you mis-scheduled it), please delete the existing booking below. </MsgBox>
                    <Line />
                    <View style={styles.container}>
                        {appointments.map((appointment, index) => (
                            <View key={index} style={styles.itemBox}>
                            <Text style={styles.itemText}>Name:  {appointment.fullName}</Text>
                            <Text></Text>
                            <Text style={styles.itemText}>Phone Number: {appointment.phoneNumber}</Text>
                            <Text></Text>
                            <Text style={styles.itemText}>Pooja Type: {appointment.name}</Text>
                            <Text></Text>
                            <Text style={styles.itemText}>Your message: {appointment.note}</Text>
                            <Text></Text>
                            <Text style={styles.itemText}>Day: {appointment.Day.toDate().toDateString()}</Text>
                            <Text></Text>
                            <Text style={styles.itemText}>Trying to fix^: {appointment.day}</Text>
                            <Text></Text>
                            <TouchableOpacity onPress={() => handleDelete(index)}>
                                <Icon name="trash" size={30} color="#900" />
                            </TouchableOpacity>
                            <Text></Text>
                            </View>
                        ))}
                    </View>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>

        /*test commment for github*/

    );
};

const handleDelete = (index) => {
    // Add your delete logic here
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    itemBox: {
        borderWidth: 0,
        borderColor: '#000',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#ffe',
        shadowColor: "#ffbf00",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 15.84,
        elevation: 5,
    },
    itemText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
});

export default Booking;