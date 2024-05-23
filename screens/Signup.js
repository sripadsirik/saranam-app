import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Formik} from 'formik';
import {View, TouchableOpacity} from 'react-native';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import {auth, analytics} from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Alert } from 'react-native';
import { Text } from 'react-native';



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
    TextLinkContent,
}from './../components/styles';

const {brand, darkLight, primary} = Colors;

const Signup = ({navigation}) => {
    // let sound = new Audio.Sound();

    // useEffect(() => {
    //     const loadSound = async () => {
    //     try {
    //         await sound.loadAsync(require('../assets/saranam.mp3'));
    //         await sound.playAsync();
    //     } catch (error) {
    //         console.log(error);
    //     }
    //     };

    //     loadSound();

    //     return () => {
    //     sound.unloadAsync();
    //     };
    // }, []);

    const [hidePassword, setHidePassword] = useState(true); 
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        if (password.length < 8) {
            Alert.alert(
                "Password Error",
                "Password should be at least 8 characters long.",
                [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
            return;
        }
    
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('User signed up:', user);
            navigation.navigate('BottomTabs');
        } catch (error) {
            console.error('Error signing up:', error);
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert(
                    "Registration Error",
                    "The email address is already in use by another account.",
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            }
        }
    };



    return(
        <KeyboardAvoidingWrapper>
        <StyledContainer>
        <StatusBar style="dark" />
            <InnerContainer>
                <PageTitle>Saranam Yatra Chicago</PageTitle>
                <SubTitle>Account Signup</SubTitle>

                <Formik
                    initialValues = {{fullName: '', email: '', password: ''}}
                    onSubmit={(values) => {
                        console.log(values);
                        handleSignup();
                    }}
                >{({handleChange, handleBlur, handleSubmit, values}) => (<StyledFormArea>

                    <MyTextInput 
                        label="Email Address"
                        icon="mail"
                        placeholder="youremail@email.com"
                        placeholderTextColor={darkLight}
                        onChangeText={text => setEmail(text)}
                        onBlur={handleBlur('email')}
                        value={email}
                        keyboardType="email-address"
                    />

                    <MyTextInput 
                        label="Password"
                        icon="lock"
                        placeholder="*************"
                        placeholderTextColor={darkLight}
                        onChangeText={text => setPassword(text)}
                        onBlur={handleBlur('password')}
                        value={password}
                        secureTextEntry={hidePassword}
                        isPassword={true}
                        hidePassword={hidePassword}
                        setHidePassword={setHidePassword}
                    />

                    <StyledButton onPress={handleSubmit}>
                        <ButtonText>
                            Signup
                        </ButtonText>
                    </StyledButton>
                    <Line />
                    <Text> To login with Google, navigate to Login </Text>
                    <ExtraView>
                        <ExtraText>
                            Already Have an Account?
                        </ExtraText>
                        <TextLink onPress={() => navigation.navigate('Login')}>
                            <TextLinkContent> Login</TextLinkContent>
                        </TextLink>
                    </ExtraView>
                    <Text> </Text>
                    <TextLink onPress={() => navigation.navigate('Start')}>
                        <TextLinkContent> Back to Start Page </TextLinkContent>
                    </TextLink>
                </StyledFormArea>)}
                </Formik>
            </InnerContainer>
        </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, isDate, showDatePicker, ...props }) => {
    return (
      <TouchableOpacity activeOpacity={1} onPress={isDate ? showDatePicker : undefined} style={{ position: 'relative' }}>
        <View>
          <LeftIcon>
            <Octicons name={icon} size={30} color={brand} />
          </LeftIcon>
          <StyledInputLabel>{label}</StyledInputLabel>
          <StyledTextInput {...props} pointerEvents={isDate ? 'none' : 'auto'} onChangeText={props.onChangeText} />
          {isPassword && (
            <RightIcon onPress={() => setHidePassword(!hidePassword)}>
              <Ionicons name={hidePassword ? 'eye' : 'eye-off'} size={30} color={darkLight} />
            </RightIcon>
          )}
        </View>
      </TouchableOpacity>
    );
};

export default Signup;