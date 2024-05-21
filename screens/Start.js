import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import {Formik} from 'formik';
import {View} from 'react-native';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import signInWithEmailAndPassword from Firebase Auth
import { auth } from '../firebase'; // Import the auth object from your firebase.js file
import '../navigators/RootStack';
import { Alert } from 'react-native';
import { Text } from 'react-native';
import { Button, Linking } from 'react-native';
import { Audio } from 'expo-av';

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

const Start = ({navigation}) => {
    let sound = new Audio.Sound();

    useEffect(() => {
        const loadSound = async () => {
        try {
            await sound.loadAsync(require('../assets/saranam.mp3'));
            await sound.playAsync();
        } catch (error) {
            console.log(error);
        }
        };

        loadSound();

        return () => {
        sound.unloadAsync();
        };
    }, []);
    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={require('./../assets/img1.webp')} />
                    <PageTitle>Saranam Yatra Chicago</PageTitle>

                    <SubTitle> Swamy Saranam </SubTitle>

                    <Text> If you haven't signed up to be a swamy yet, please do so below: </Text>
                    <Button
                        title="Swamy Signup"
                        onPress={() => Linking.openURL('https://www.example.com')}
                    />

                    <ExtraView>
                        <ExtraText>
                            Don't Have an Account already?
                        </ExtraText>
                        <TextLink onPress={() => navigation.navigate('Signup')}>
                            <TextLinkContent> Signup</TextLinkContent>
                        </TextLink>
                    </ExtraView>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

export default Start;