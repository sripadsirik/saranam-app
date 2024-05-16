import React, {useState} from 'react';
import {View, Text} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {ScrollView} from "react-native";
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

import{

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
}from '../components/stylesw';
import { MsgBox } from '../components/styles';

const My_Bookings = () => {

    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle> My Pooja Time </PageTitle>
                    <Line />
                    <MsgBox> Only one booking is allowed. To schedule another (if you mis-scheduled it), please delete the existing booking below. </MsgBox>
                    <Line />
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
                
    );
};



export default My_Bookings;