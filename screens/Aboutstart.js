import React from 'react';
import { View, Text, StatusBar, Image, ScrollView, StyleSheet, TouchableOpacity, Linking, Button } from 'react-native';
import { 
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
} from './../components/stylesa';
import { ItemBox } from '../components/styles';

const Aboutstart = ({navigation}) => {

    const handleEmailPress = () => {
        Linking.openURL('mailto:saranamyatrachicago@gmail.com');
    };

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

                    <Image
                        source={require('../pictures/IMG20231117220136.jpg')} // Replace with your image URL or require('path/to/image')
                        style={{ width: '100%', height: undefined, aspectRatio: 1, alignSelf: 'center', marginTop: 0, marginBottom: 0 }} // Adjust marginTop to reduce space above and marginBottom to reduce space below
                        resizeMode="contain"
                    />

                    <Line style={{ marginTop: 0 }} />
                    
                    <SubTitle> Our Mission </SubTitle>
                    <MsgBox style={msgBoxStyles.container}> 
                        The mission/purpose of SARANAM YATRA is:
                        {"\n"}{"\n"}• Operate a Cultural and Spiritual Center to propagate and perpetuate the religious
                        and cultural aspects of the worship of Lord Ayyappa,
                        {"\n"}{"\n"}• To promote the awareness of Lord Ayyappa and deities associated with Lord
                        Ayyappa to the community,
                        {"\n"}{"\n"}• To publish electronic and print publications to promote the awareness of Lord
                        Ayyappa and associated deities to the community,
                        {"\n"}{"\n"}• To organize spiritual events as well as religious events that are associated with
                        the worship of Lord Ayyappa and associated deities,
                        {"\n"}{"\n"}• To promote and participate Ayyappa temples around Tri State Area in Midwest.
                        {"\n"}{"\n"}• Provide assistance to other communities (local and worldwide) in the area of
                        human, religious and community assistance services.
                    </MsgBox>
                    <MsgBox></MsgBox>
                    <MsgBox style={msgBoxStyles.container}>
                    We accomplish this in partnership with the various temples &amp; devotee homes in the Tr-
State Midwest area by helping the temple to conduct various pujas throughout the year,
including: Mandala Puja, Makara Sankaranthi Puja, Vishu,  Weekly Abhishekham for
Lord Ayyappa, and Irumudi Puja for interested devotees.
                    </MsgBox>

                    <Image
                        source={require('../pictures/IMG20231118204426.jpg')} // Replace with your image URL or require('path/to/image')
                        style={{ width: '100%', height: undefined, aspectRatio: 1, alignSelf: 'center', marginTop: 10, marginBottom: 10 }} // Adjust marginTop to reduce space above and marginBottom to reduce space below
                        // resizeMode="contain"
                    />

                    <Line style={{ marginTop: 0 }} />

                    <SubTitle> Our History </SubTitle>
                    <MsgBox style={msgBoxStyles.container}> 
                    Ayyappa Devotee Community is a virtual organization that was formed by a group of active devotees
of Lord Ayyappa in the Greater Chicago area led by our Guruswamy Shri Kailash
Talreja . We are proud to have hundreds of active members in the group. We also
formed a volunteer specific sub group called Ayyappa SARANAM YATRA, Chicago
.
                    </MsgBox>
                    <MsgBox></MsgBox>
                    <MsgBox style={msgBoxStyles.container}> 
                    Ayyappa Devotee Community was founded with the goal of creating a

nimble, fast moving organization that serves the needs of Ayyappa devotees worldwide.
When we look back at what SARANAM YATRA has been involved in over the years,
the divine intervention of Swami Ayyappan is evident every step of the way.
                    </MsgBox>
                    <MsgBox></MsgBox>
                    <MsgBox style={msgBoxStyles.container}> 
                    Today
SARANAM YATRA is a volunteer &amp; devotee-owned organization which serves as a
point of continuity and confluence for Ayyappa devotees.
                    </MsgBox>
                    <MsgBox></MsgBox>

                    <Image
                        source={require('../pictures/1.jpg')} // Replace with your image URL or require('path/to/image')
                        style={{ width: '100%', height: undefined, aspectRatio: 1, alignSelf: 'center', marginTop: 0, marginBottom: 0 }} // Adjust marginTop to reduce space above and marginBottom to reduce space below
                        resizeMode="contain"
                    />

                    <Line style={{ marginTop: 10 }} />

                    <SubTitle> Our Typical Calendar Year </SubTitle>
                    <MsgBox style={msgBoxStyles.container}> 
                        {"\n"}{"\n"}• Ayyappa Laksharchana and Grand Feast is conducted around Mandalam season
where more than hundred devotees perform Sahasra Nama Archana for Lord
Ayyappa as we embark the “prana-pratishta “ process
                        {"\n"}{"\n"}• The busiest time in the calendar for Ayyappa devotees is the Mandalam season,
beginning in mid-November and lasting for six weeks. This period coincides with
the season in Sabarimala where devotees wear Mala and observe Vratam (fast)
for six weeks. Every week we assemble at the temple and homes of Ayyappa
devotees for an evening of high octave bhajan and grand Maha-prasadam.
                        {"\n"}{"\n"}• Grand Irumudi Puja is conducted at the end of Mandalam Season to mark the
end of the Vrath by filling a coconut with Ghee and carrying the Irumudi around
the temple to mark the similar journey to Sabarimala, performing abhishekam to
Lord Ayyappa afterwards
                        {"\n"}{"\n"}• Makara Jyothi Celebrations include a grand abhishekam and puja. This usually
                        takes place in January coinciding with the date in Sabarimala
                    </MsgBox>
                    <MsgBox></MsgBox>

                    <Image
                        source={require('../pictures/3.jpg')} // Replace with your image URL or require('path/to/image')
                        style={{ width: '100%', height: undefined, aspectRatio: 1, alignSelf: 'center', marginTop: 0, marginBottom: 0 }} // Adjust marginTop to reduce space above and marginBottom to reduce space below
                        resizeMode="contain"
                    />

<Image
                        source={require('../pictures/2.jpg')} // Replace with your image URL or require('path/to/image')
                        style={{ width: '100%', height: undefined, aspectRatio: 1, alignSelf: 'center', marginTop: 0, marginBottom: 0 }} // Adjust marginTop to reduce space above and marginBottom to reduce space below
                        resizeMode="contain"
                    />

                    <Line style={{ marginTop: 10 }} />

                    <SubTitle> We look forward to your participation in all of these events. Besides these events,
                    SARANAM YATRA also participates in other events for the community. “TATWAMASI" </SubTitle>

                    <View style={[{ marginVertical: 10, alignItems: 'center' }, msgBoxStyles.container]}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, alignItems: 'center' }}> Contact Us </Text>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, alignItems: 'center' }}> Email: </Text>
                        <TouchableOpacity onPress={() => Linking.openURL('mailto:saranamyatrachicago@gmail.com')} style={{ marginBottom: 10}}>
                            <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 16 }}>
                                saranamyatrachicago@gmail.com
                            </Text>
                        </TouchableOpacity>
                        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10, alignItems: 'center' }}> Phone: </Text>
                        <TouchableOpacity onPress={() => Linking.openURL('tel:+14842243384')}>
                            <Text style={{ color: 'blue', textDecorationLine: 'underline', fontSize: 16, marginTop: 10 }}>
                                +1 484-224-3384
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <PageTitle> Thank You </PageTitle>
                    <Line style={{ marginTop: 200 }} />
 
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
