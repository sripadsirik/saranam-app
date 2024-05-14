import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {ScrollView} from "react-native";
import { auth } from '../firebase'; // Import auth from your firebase.js file
import { signOut } from 'firebase/auth'; // Import signOut from firebase/auth
import FlashMessage, { showMessage } from "react-native-flash-message";

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
            console.log('User signed out');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error signing out:', error); /*bruh*/
        }
    }

    return(
        <StyledContainer>
        <StatusBar style="dark" />
            <InnerContainer>
                {/* <WelcomeImage resizeMode="cover" source={require('./../assets/img2.webp')} */}

                <WelcomeContainer> 
                    <PageTitle welcome={true}>Welcome Swamy</PageTitle>
                    <SubTitle welcome={true}>Swamy Saranam {userEmail}</SubTitle>
                <StyledFormArea>
                    <Avatar resizeMode="cover" source={require('./../assets/img1.webp')} />

                    <Line />
                    <StyledButton onPress={handleSignOut}>
                        <ButtonText>
                            Logout
                        </ButtonText>
                    </StyledButton>
                </StyledFormArea>
                </WelcomeContainer>

            </InnerContainer>
            <FlashMessage position="top" /> 
        </StyledContainer>
        
    );
};

export default Welcome;