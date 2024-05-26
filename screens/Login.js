import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Formik} from 'formik';
import {View} from 'react-native';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import signInWithEmailAndPassword from Firebase Auth
import { auth } from '../firebase'; // Import the auth object from your firebase.js file
import '../navigators/RootStack';
import { Alert } from 'react-native';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
}from './../components/styles';

import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const {brand, darkLight, primary} = Colors;

const Login = ({}) => {
    const navigation = useNavigation();
    const [hidePassword, setHidePassword] = useState(true); 

    const isValidEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    return(
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    {/* <PageLogo resizeMode="cover" source={require('./../assets/img1.webp')} /> */}
                    <PageTitle>Saranam Yatra Chicago</PageTitle>
                    <SubTitle>Account Login</SubTitle>

                    <Formik
                        initialValues = {{email: '', password: ''}}
                        onSubmit={async (values) => {
                            if (!isValidEmail(values.email)) {
                                Alert.alert('Error', 'The email is incorrect.');
                                return;
                            }

                            try {
                              await signInWithEmailAndPassword(auth, values.email, values.password);
                              console.log('User logged in successfully!', values.email);
                              navigation.reset({
                                index: 0,
                                routes: [{ name: 'BottomTabs' }],
                              });
                            } catch (error) {
                              console.error('Error logging in:', error);
                              Alert.alert('Error', 'The password is incorrect. (check your email too)'); // Display an alert with the error message
                            }
                          }}
                    >{({handleChange, handleBlur, handleSubmit, values}) => (<StyledFormArea>
                        <MyTextInput 
                            label="Email Address"
                            icon="mail"
                            placeholder="youremail@email.com"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            keyboardType="email-address"
                        />

                        <MyTextInput 
                            label="Password"
                            icon="lock"
                            placeholder="*************"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            value={values.password}
                            secureTextEntry={hidePassword}
                            isPassword={true}
                            hidePassword={hidePassword}
                            setHidePassword={setHidePassword}
                        />
                        <StyledButton onPress={handleSubmit}>
                            <ButtonText>
                                Login
                            </ButtonText>
                        </StyledButton>
                        <Line />
                        <StyledButton google={true} >
                                <Fontisto name="google" color={primary} size={25} />
                            <ButtonText google={true}>
                                Sign in with Google
                            </ButtonText>
                        </StyledButton>
                        <ExtraView>
                            <ExtraText>
                                Don't Have an Account already?
                            </ExtraText>
                            <TextLink onPress={() => navigation.navigate('Signup')}>
                                <TextLinkContent> Signup</TextLinkContent>
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

const MyTextInput = ({label, icon, isPassword, hidePassword, setHidePassword, ...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'eye' : 'eye-off'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    )
}

export default Login;