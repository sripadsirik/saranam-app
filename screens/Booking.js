import React from 'react';
import {View, Text} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.js';

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
    const [bookingData, setBookingData] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "app", "IO123mmEtVuuPT2pvNrm"), (doc) => {
            setBookingData(doc.data());
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []);

    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle> My Pooja Time </PageTitle>
                    <Line />
                    <MsgBox> Only one booking is allowed. To schedule another (if you mis-scheduled it), please delete the existing booking below. </MsgBox>
                    <Line />
                    {bookingData && (
                        <ItemBox>
                            <Text>Full Name: {bookingData.fullName}</Text>
                            <Text>Type of Event: {bookingData.name}</Text>
                            <Text>Phone Number: {bookingData.phoneNumber}</Text>
                            <Text>Date: {bookingData.Day}</Text>
                            <Text>Additional Notes: {bookingData.note}</Text>
                        </ItemBox>
                    )}
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

export default Booking;