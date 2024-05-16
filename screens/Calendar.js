import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {ScrollView} from "react-native";
import { Agenda } from 'react-native-calendars';

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

const Calendar = () => {

    // Define renderItem
    const renderItem = (item) => {
        return (
            <View style={{backgroundColor: 'white', padding: 20, marginRight: 10, marginTop: 17}}>
                <Text>{item.name}</Text>
            </View>
        );
    };

    return(
        <View style={{ flex: 1 }}>
            <Agenda
            />
        </View>
    );
};



export default Calendar;