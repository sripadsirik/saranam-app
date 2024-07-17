import React, {useState} from 'react';
import {View, Text} from 'react-native';
import { StyleSheet, TouchableOpacity, Button, StatusBar } from 'react-native';
import {ScrollView} from "react-native"

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
    StyledContainer,
    MsgBox
}from './../components/stylesa';
import { ItemBox } from '../components/styles';

const About = () => {

    return(
        <ScrollView>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle> About Saranam Yatra Chicago </PageTitle>
                    <Line />
                    <SubTitle> TATWAMASI </SubTitle>
                    <MsgBox>SARANAM YATRA is a friends and community-oriented organization led by our
Guruswamy Shri Kailash Talreja , consisting of the devotees of Lord Ayyappa based out
of the Greater Chicago area, Illinois USA &amp; Grand Rapids, MI. The group has hundreds
of members and volunteers who have been actively conducting pujas and bhajans in
praise of Lord Ayyappa since the past decade.</MsgBox>
                </InnerContainer>
            </StyledContainer>
        </ScrollView>
    );
};


export default About;