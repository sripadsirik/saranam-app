import React, { useEffect, useState } from 'react';
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
    const [isPlaying, setIsPlaying] = useState(true);

    const toggleSound = async () => {
        if (isPlaying) {
        await sound.stopAsync();
        } else {
        await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        const loadSound = async () => {
        try {
            await sound.loadAsync(require('../assets/saranam.mp3'));
            if (isPlaying) {
            await sound.playAsync();
            }
        } catch (error) {
            console.log(error);
        }
        };

        loadSound();

        return () => {
        sound.unloadAsync();
        };
    }, [isPlaying]);

    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={require('./../assets/img1.webp')} />
                    <PageTitle>Saranam Yatra Chicago</PageTitle>

                    <SubTitle> Swamy Saranam </SubTitle>
                    <StatusBar style="dark" />
                    <Button title={isPlaying ? "Mute Music" : "Unmute Music"} onPress={toggleSound} />
                    <Text> </Text>

                    <Text> If you haven't signed up to be a swamy yet, please do so below: </Text>
                    <Button
                        title="Swamy Signup"
                        onPress={() => Linking.openURL('https://www.example.com')}
                    />
                    <Line></Line>
                    <Text>
                        Next to use the app, either signup or login:
                    </Text>
                    <Text> </Text>
                    <TextLink onPress={() => navigation.navigate('Signup')}>
                        <TextLinkContent> Signup </TextLinkContent>
                    </TextLink>
                    <Text> </Text>
                    <TextLink onPress={() => navigation.navigate('Login')}>
                        <TextLinkContent> Login </TextLinkContent>
                    </TextLink>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

export default Start;