import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { View, Alert, Text, Modal, TouchableOpacity } from 'react-native';
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth'; // Import the necessary functions
import { auth } from '../firebase'; // Import the auth object from your firebase.js file
import '../navigators/RootStack';
import { useNavigation } from '@react-navigation/native';

import {
    StyledContainer,
    InnerContainer,
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
} from './../components/styles';

import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const { brand, darkLight, primary } = Colors;

const Login = () => {
    const navigation = useNavigation();
    const [hidePassword, setHidePassword] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [emailForReset, setEmailForReset] = useState('');

    const isValidEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    // Function to handle password reset
    const handlePasswordReset = async () => {
        if (!isValidEmail(emailForReset)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        try {
            await sendPasswordResetEmail(auth, emailForReset);
            Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
            setModalVisible(false); // Close modal after success
        } catch (error) {
            console.error('Error resetting password:', error);
            Alert.alert('Error', 'Failed to send password reset email.');
        }
    };

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle>Saranam Yatra Chicago</PageTitle>
                    <SubTitle>Account Login</SubTitle>

                    <Formik
                        initialValues={{ email: '', password: '' }}
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
                                Alert.alert('Error', 'The password is incorrect. (check your email too)');
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values }) => (
                            <StyledFormArea>
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
                                    <ButtonText>Login</ButtonText>
                                </StyledButton>

                                {/* Forgot Password Link opens Modal */}
                                <TextLink onPress={() => setModalVisible(true)}>
                                    <TextLinkContent>Forgot Password?</TextLinkContent>
                                </TextLink>

                                <Line />

                                <ExtraView>
                                    <ExtraText>Don't Have an Account already?</ExtraText>
                                    <TextLink onPress={() => navigation.navigate('Signup')}>
                                        <TextLinkContent> Signup</TextLinkContent>
                                    </TextLink>
                                </ExtraView>

                                <Text> </Text>
                                <TextLink onPress={() => navigation.navigate('Start')}>
                                    <TextLinkContent> Back to Start Page </TextLinkContent>
                                </TextLink>
                            </StyledFormArea>
                        )}
                    </Formik>

                    {/* Modal for password reset */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{
                                width: 300,
                                backgroundColor: 'white',
                                padding: 20,
                                borderRadius: 10,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.25,
                                shadowRadius: 4,
                                elevation: 5,
                            }}>
                                <Text style={{ marginBottom: 15, textAlign: 'center' }}>Enter your email</Text>
                                <MyTextInput
                                    label="Email Address"
                                    icon="mail"
                                    placeholder="youremail@email.com"
                                    placeholderTextColor={darkLight}
                                    onChangeText={setEmailForReset}
                                    value={emailForReset}
                                    keyboardType="email-address"
                                />
                                <View style={{ marginTop: 20 }}>
                                    <StyledButton onPress={handlePasswordReset}>
                                        <ButtonText>Send Reset Link</ButtonText>
                                    </StyledButton>
                                    <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                                        <Text style={{ textAlign: 'center', marginTop: 10 }}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
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
    );
};

export default Login;
