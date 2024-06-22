import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {ScrollView} from "react-native";
import { auth } from '../firebase'; // Import auth from your firebase.js file
import { signOut } from 'firebase/auth'; // Import signOut from firebase/auth
import FlashMessage, { showMessage } from "react-native-flash-message";
import { Alert } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { useRef } from 'react';
import { Audio } from 'expo-av';
import { Button } from 'react-native';


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
}from './../components/stylesw';

const Welcome = ({navigation}) => {
  const sound = useRef(new Audio.Sound());
  const [isPlaying, setIsPlaying] = useState(true);

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

    // Unload sound when component unmounts
    return () => {
      sound.current.unloadAsync();
    };
  }, []);

    const [userEmail, setUserEmail] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            const atIndex = user.email.indexOf('@');
            const extractedUsername = atIndex !== -1 ? user.email.slice(0, atIndex) : user.email;
            setUserEmail(extractedUsername);
    
            // Show flash message
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
            toggleSound(); // Add this line to stop the music
            console.log('User signed out');
            Alert.alert('Logged out', 'User logged out successfully');
    
            // Reset the navigation stack
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  { name: 'Login' },
                ],
              })
            );
    
            onAuthStateChanged(auth, (user) => {
                if (user) {
                  console.log('User is signed in');
                } else {
                  console.log('User is signed out');
                }
              });
        } catch (error) {
            console.error('Error signing out:', error); // Log the error
        }
      }

    return(
        <StyledContainer>
        <StatusBar style="dark" />
            <InnerContainer>
                

                
                <WelcomeContainer> 
                  
                    <StyledButton onPress={handleSignOut}>
                        <ButtonText>
                            Logout
                        </ButtonText>
                    </StyledButton>
                  
                <Line />
                    <PageTitle welcome={true}>Welcome Swamy</PageTitle>
                    <SubTitle welcome={true}>Swamy Saranam {userEmail}</SubTitle>
                    <Button title={isPlaying ? "Mute Music" : "Unmute Music"} onPress={toggleSound} />
                    <StyledFormArea>
                        <Avatar resizeMode="cover" source={require('./../assets/img1.webp')} />

                        <Line />
                    </StyledFormArea>
                </WelcomeContainer>

            </InnerContainer>
            <FlashMessage position="top" /> 
        </StyledContainer>
        
    );
};


export default Welcome;