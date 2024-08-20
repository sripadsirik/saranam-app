import React from 'react';
import { View, Text, StatusBar, Image, ScrollView, StyleSheet, Button } from 'react-native';
import { 
    InnerContainer, 
    PageTitle, 
    SubTitle, 
    Line, 
    StyledContainer, 
    MsgBox 
} from './../components/stylesa';

const Aboutstart = ({ navigation }) => {
    return (
        <ScrollView>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                <Text> </Text>
            <Text> </Text>
            <Text> </Text>
                    <Button title="Back to Start" onPress={() => navigation.navigate('Start')} />
                    <PageTitle> About Saranam Yatra Chicago </PageTitle>
                    <Line />
                    <SubTitle> TATWAMASI </SubTitle>
                    <MsgBox style={msgBoxStyles.container}> 
                        SARANAM YATRA is a friends and community-oriented organization led by our
                        Guruswamy Shri Kailash Talreja, consisting of the devotees of Lord Ayyappa based out
                        of the Greater Chicago area, Illinois USA & Grand Rapids, MI. The group has hundreds
                        of members and volunteers who have been actively conducting pujas and bhajans in
                        praise of Lord Ayyappa since the past decade.
                    </MsgBox>
                    {/* Rest of the content remains unchanged */}
                    <Image
                        source={require('../pictures/IMG20231117220136.jpg')} // Replace with your image URL or require('path/to/image')
                        style={{ width: '100%', height: undefined, aspectRatio: 1, alignSelf: 'center', marginTop: 0, marginBottom: 0 }} // Adjust marginTop to reduce space above and marginBottom to reduce space below
                        resizeMode="contain"
                    />
                    {/* Continue with other content... */}
                </InnerContainer>
            </StyledContainer>
        </ScrollView>
    );
};

const msgBoxStyles = StyleSheet.create({
    container: {
        borderWidth: 0,
        borderColor: '#000',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#f9e6ff', // Light purple background
        shadowColor: "#9b30ff", // Purple shadow
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 15.84,
        elevation: 5,
    },
    text: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
});

export default Aboutstart;
