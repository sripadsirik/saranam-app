import { React, useState, useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
                    <View>
                        {appointments.map((appointment, index) => (
                            <View key={index}>
                                <Text>{appointment.name}</Text>
                                <Text>{appointment.phoneNumber}</Text>
                                <Text>{appointment.name}</Text>
                                <Text>{appointment.note}</Text>
                                <Text>{appointment.Day.toDate().toDateString()}</Text>
                            </View>
                        ))}
                    </View>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>

        /*test commment for github*/

    );
};

export default Booking;