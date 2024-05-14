import React, {useState} from 'react';
import {View, Text} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {ScrollView} from "react-native"

// import{

//     InnerContainer,
//     PageLogo,
//     PageTitle,
//     SubTitle,
//     StyledFormArea,
//     StyledButton,
//     ButtonText,
//     Line,
//     WelcomeContainer,
//     WelcomeImage,
//     Avatar,
//     StyledContainer
// }from './../components/stylesw';

const About = () => {
    const [hidePassword, setHidePassword] = useState(true); 

    return(
        <View>
            <Text>About Us</Text>
        </View>
    );
};



export default About;