import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Formik} from 'formik';
import {View} from 'react-native';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import signInWithEmailAndPassword from Firebase Auth
import { auth } from '../firebase'; // Import the auth object from your firebase.js file
import '../navigators/RootStack';
import { Alert } from 'react-native';

import{
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    StyledFormArea,
    LeftIcon, 
    StyledInputLabel,
    StyledTextInput,
    RightIcon,
    Colors,
    StyledButton,
    ButtonText,
    MsgBox,
    Line,
    ExtraView,
    ExtraText,
    TextLink,
    TextLinkContent
}from './../components/stylesl';

import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const {brand, darkLight, primary} = Colors;

const Login = ({navigation}) => {
    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={require('./../assets/img1.webp')} />
                    <PageTitle>Saranam Yatra Chicago</PageTitle>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

export default Login;