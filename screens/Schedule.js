import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {Formik} from 'formik';
import {TouchableOpacity} from 'react-native';
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { ScrollView } from 'react-native';
import {auth, analytics} from '../firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Modal, Button, View } from 'react-native'; // Make sure Modal, Button, and View are imported
import { Picker } from '@react-native-picker/picker';


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
}from './../components/styleschedule';

const {brand, darkLight, primary} = Colors;

const Schedule = () => {
    


    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
    const [name, setName] = useState(''); // Changed email to name and set default value to 'Pooja/Beeksha'
    const [phoneNumber, setPhoneNumber] = useState(''); // New state for the phone number
    
    
    const [note, setNote] = useState(''); // New state for the note box
    
    const [show, setShow] = useState(false);
    const [dob, setDob] = useState();
    const [date, setDate] = useState(new Date());

    const [isPickerVisible, setPickerVisible] = useState(false);
    const [pickerValue, setPickerValue] = useState('');


    const onChange = (handleChange, event, selectDate) => {
        const currentDate = selectDate || date;
        setDate(currentDate);
        const formattedDate = currentDate.toDateString();  
        setDob(new Date(formattedDate));
        handleChange('Day')(formattedDate);
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
        setShow(true); // Add this line
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
        setShow(false); // Add this line
    };

    const handleConfirm = (handleChange, selectedDate) => {
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = `${selectedDate.getFullYear()}-${('0' + (selectedDate.getMonth() + 1)).slice(-2)}-${('0' + selectedDate.getDate()).slice(-2)}`;
            handleChange('Day')(formattedDate);
        }
        hideDatePicker();
    };

    return(
        <KeyboardAvoidingWrapper>
        <StyledContainer>
            <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle> Schedule </PageTitle>
                    <MsgBox> </MsgBox>
                    <Line />
                    <MsgBox> </MsgBox>

                    

                    <Formik
                        initialValues = {{fullName: '', name: '', phoneNumber: '', Day: '', note: ''}} // Added phoneNumber to initialValues
                        onSubmit={(values) => {
                            if (!values.fullName || values.fullName.length < 2 || values.fullName.length > 100) {
                                Alert.alert('Error', 'Full Name must be between 2 and 100 characters');
                            } else if (!values.name || !['Abhishekam', 'Beeksha'].includes(values.name)) {
                                Alert.alert('Error', 'Invalid selection for type of pooja Abhishekam/Beeksha');
                            } else if (!values.phoneNumber || !/^[0-9]{10}$/.test(values.phoneNumber)) {
                                Alert.alert('Error', 'Phone Number must be exactly 10 digits');
                            } else if (!values.Day) {
                                Alert.alert('Error', 'Day is required, other than the current day or past day');
                            } else {
                                console.log(values);
                            }
                        }}
                    >{({handleChange, handleBlur, handleSubmit, values}) => (<StyledFormArea>
                        

                        {show && (
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                date={date}
                                onConfirm={(selectedDate) => handleConfirm(handleChange, selectedDate)}
                                onCancel={hideDatePicker}
                            />
                        )}
                        {/* <Text>
                            Selected Date: {date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}` : 'No date selected'}
                        </Text> */}
                    
                        <MyTextInput 
                            label="Full Name"
                            icon="person"
                            placeholder="Ling Lee"
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('fullName')}
                            onBlur={handleBlur('fullName')}
                            value={values.fullName}
                        />
                        {/* <MyTextInput 
                            label="A = Abhishekam or B = Beeksha"
                            icon="home"
                            placeholder="A/B"
                            placeholderTextColor={darkLight}
                            onChangeText={(text) => {
                                setName(text);
                                handleChange('name')(text);
                            }}
                            onBlur={handleBlur('name')}
                            value={name}
                        /> */}
                        
                        <MyTextInput 
                            label="A = Abhishekam or B = Beeksha"
                            icon="home"
                            placeholder="Abhishekam/Beeksha"
                            placeholderTextColor={darkLight}
                            // onChangeText={(text) => {
                            //     setName(text);
                            //     handleChange('name')(text);
                            // }}
                            onBlur={handleBlur('name')}
                            value={name}
                            onFocus={() => setPickerVisible(true)} // Show the Picker when the TextInput is focused
                            
                        />

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={isPickerVisible}
                            onRequestClose={() => {
                                setPickerVisible(!isPickerVisible);
                            }}
                        >
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <View style={{backgroundColor: 'white', padding: 20, borderRadius: 10}}>
                                    <Picker
                                        selectedValue={pickerValue} // Change this line
                                        onValueChange={(itemValue, itemIndex) => {
                                            setPickerValue(itemValue); // Change this line
                                            setName(itemValue);
                                            handleChange('name')(itemValue);
                                            setPickerVisible(true); // Hide the Picker when an item is selected
                                        }}
                                    >
                                        <Picker.Item label="Select..." value="" />
                                        <Picker.Item label="Abhishekam" value="Abhishekam" />
                                        <Picker.Item label="Beeksha" value="Beeksha" />
                                    </Picker>

                                    <Button
                                        title="Close"
                                        onPress={() => setPickerVisible(!isPickerVisible)}
                                    />
                                </View>
                            </View>
                        </Modal>

                        <MyTextInput 
                            label="Phone Number (without +1)"
                            icon="device-mobile"
                            placeholder="1234567890"
                            placeholderTextColor={darkLight}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                setPhoneNumber(text);
                                handleChange('phoneNumber')(text);
                            }}
                            onBlur={handleBlur('phoneNumber')}
                            value={phoneNumber}
                        /> 

                        {/* <MyTextInput 
                            label="When would you like to schedule?"
                            icon="calendar"
                            placeholder="YYYY - MM - DD"
                            placeholderTextColor={darkLight}
                            onChangeText={(text) => {
                                console.log('Text entered:', text);
                                const date = new Date(text);
                                setDob(date);
                                const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
                                handleChange('Day')(formattedDate);
                                console.log('Day:', formattedDate);
                            }}
                            value={dob ? `${dob.getFullYear()}-${('0' + (dob.getMonth() + 1)).slice(-2)}-${('0' + dob.getDate()).slice(-2)}` : ''}
                            onBlur={handleBlur('Day')}
                            isDate={true}
                            editable={false}
                            showDatePicker={showDatePicker}
                        /> */}

                        {/* <Button title="When would you like to schedule?" onPress={showDatePicker} />
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={(selectedDate) => handleConfirm(handleChange, selectedDate)}
                            onCancel={hideDatePicker}
                        />


                        <MyTextInput 
                            label="Selected Date"
                            icon="calendar"
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor={darkLight}
                            value={date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}` : 'No date selected'}
                            editable={false}
                        /> */}

                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={(selectedDate) => handleConfirm(handleChange, selectedDate)}
                            onCancel={hideDatePicker}
                        />

                        <MyTextInput 
                            label="Selected Date"
                            icon="calendar"
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor={darkLight}
                            value={date ? `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}` : 'No date selected'}
                            editable={true}
                            onFocus={showDatePicker} // Add this line
                        />

                        {/* Note box */}
                        <MyTextInput 
                            label="Anything else you'd like us to know?"
                            icon="note"
                            placeholder="Your message..."
                            placeholderTextColor={darkLight}
                            onChangeText={handleChange('note')}
                            onBlur={handleBlur('note')}
                            value={values.note}
                        />

                        {/* <MsgBox>...</MsgBox> */}
                        <StyledButton onPress={handleSubmit}>
                            <ButtonText>
                                Schedule
                            </ButtonText>
                        </StyledButton>
                        <Line />
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
        </View>
      </TouchableOpacity>
    );
};

export default Schedule;

//test comment for github