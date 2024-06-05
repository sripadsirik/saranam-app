import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import '../navigators/RootStack';
import { Text } from 'react-native';
import { Button, Linking } from 'react-native';
import { Audio } from 'expo-av';
import { useRef } from 'react';

import{
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    Colors,
    Line,
    TextLink,
    TextLinkContent
}from './../components/stylesl';

import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const {brand, darkLight, primary} = Colors;

const Start = ({navigation}) => {
  //   const sound = useRef(new Audio.Sound());
  // const [isPlaying, setIsPlaying] = useState(true);

  // const toggleSound = async () => {
  //   if (isPlaying) {
  //     await sound.current.stopAsync();
  //   } else {
  //     await sound.current.setPositionAsync(6000);
  //     await sound.current.playAsync();
  //   }
  //   setIsPlaying(!isPlaying);
  // };

  // useEffect(() => {
  //   const loadSound = async () => {
  //     try {
  //       await sound.current.loadAsync(
  //         require('../assets/saranam.mp3'),
  //         { isLooping: true },
  //       );
  //       await sound.current.setPositionAsync(6000);
  //       if (isPlaying) {
  //         await sound.current.playAsync();
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };
  //   loadSound();

  //   // Unload sound when component unmounts
  //   return () => {
  //     sound.current.unloadAsync();
  //   };
  // }, []);

    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={require('./../assets/img1.webp')} />
                    <PageTitle>Saranam Yatra Chicago</PageTitle>

                    <SubTitle> Swamy Saranam </SubTitle>
                    <StatusBar style="dark" />
                    {/* <Button title={isPlaying ? "Mute Music" : "Unmute Music"} onPress={toggleSound} /> */}
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