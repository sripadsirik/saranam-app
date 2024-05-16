import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { TouchableOpacity } from 'react-native';
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { ScrollView } from 'react-native';
import { auth, analytics } from '../firebase.js';
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Modal, Button, View } from 'react-native'; // Make sure Modal, Button, and View are imported
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, where, getDocs, deleteDoc, addDoc, query, doc } from "firebase/firestore";
//import { addDataToFirestore } from '../firebase.js'; // Import addDataToFirestore from firebase.js



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
    
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    
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

    // const saveAppointment = async () => {
    //     // Save the appointment data
    //     const appointmentData = {
    //         fullName: values.fullName, // the full name
    //         name: values.name, // the selected value from the Picker
    //         phoneNumber: Number(values.phoneNumber), // the phone number
    //         Day: new Date(values.Day), // the selected date
    //         note: values.note, // the note
    //         userId: user.uid, // the user's ID
    //     };
    
    //     // Save the appointment data in Firestore
    //     try {
    //         const docRef = await addDoc(collection(db, "appointments"), appointmentData);
    //         console.log("Document written with ID: ", docRef.id);
    //     } catch (e) {
    //         console.error("Error adding document: ", e);
    //     }
    // }
    

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
                        onSubmit={async (values) => {
                            if (!values.fullName || values.fullName.length < 2 || values.fullName.length > 100) {
                                Alert.alert('Error', 'Full Name must be between 2 and 100 characters');
                            } else if (!values.name || !['Abhishekam', 'Beeksha'].includes(values.name)) {
                                Alert.alert('Error', 'Invalid selection for type of pooja Abhishekam/Beeksha');
                            } else if (!values.phoneNumber || !/^[0-9]{10}$/.test(values.phoneNumber)) {
                                Alert.alert('Error', 'Phone Number must be exactly 10 digits');
                            } else if (!values.Day) {
                                Alert.alert('Error', 'Day is required, other than the current day or past day');
                            } else if (new Date(values.Day).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
                                Alert.alert('Error', 'You cannot select a date before the current date');
                            } else {
                                console.log(values);

                                const dateParts = values.Day.split("-");
                                const utcDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));                             

                                const appointmentData = {
                                    fullName: values.fullName, // the full name
                                    name: values.name, // the selected value from the Picker
                                    phoneNumber: Number(values.phoneNumber), // the phone number
                                    Day: utcDate, // the selected date
                                    day: values.Day,
                                    note: values.note, // the note
                                    userId: user.uid, // the user's ID
                                };

                                

                                // Check if the date or phone number is already used
                                const dateQuery = query(
                                    collection(db, "appointments"),
                                    where("Day", "==", utcDate),
                                );
                                const dateSnapshot = await getDocs(dateQuery);
                                if (!dateSnapshot.empty) {
                                    // If the date or phone number is already used, show an error message
                                    console.error("An appointment with this date or phone number already exists.");
                                    Alert.alert('Error', 'An appointment with this date already exists.');
                                    return;
                                }

                                // Check if the phone number is already used
                                const phoneQuery = query(
                                    collection(db, "appointments"),
                                    where("phoneNumber", "==", appointmentData.phoneNumber)
                                );
                                const phoneSnapshot = await getDocs(phoneQuery);
                                if (!phoneSnapshot.empty) {
                                    // If the phone number is already used, show an error message
                                    console.error("An appointment with this phone number already exists.");
                                    Alert.alert('Tip', 'If you want to reschedule, please delete the existing appointment first in Bookings');
                                    Alert.alert('Error', 'An appointment with this phone number already exists.');
                                    return;
                                }

                                // Check if the current user has already scheduled an appointment
                                const userAppointmentQuery = query(
                                    collection(db, "appointments"),
                                    where("userId", "==", user.uid)
                                );
                                const userAppointmentSnapshot = await getDocs(userAppointmentQuery);

                                // Check if the phone number or date is already used
                                // const dateOrPhoneQuery = query(
                                //     collection(db, "appointments"),
                                //     where("Day", "==", utcDate),
                                //     where("phoneNumber", "==", appointmentData.phoneNumber)
                                // );
                                // const dateOrPhoneSnapshot = await getDocs(dateOrPhoneQuery);

                                // if (!dateOrPhoneSnapshot.empty) {
                                //     // If the date or phone number is already used, show an error message
                                //     console.error("An appointment with this date or phone number already exists.");
                                //     Alert.alert('Error', 'An appointment with this date or phone number already exists.');
                                //     return;
                                if (!userAppointmentSnapshot.empty) {
                                    // If the user has already scheduled an appointment, delete it
                                    const docId = userAppointmentSnapshot.docs[0].id;
                                    await deleteDoc(doc(db, 'appointments', docId));
                                    Alert.alert('NICE', 'Your previous appointment has been deleted.');
                                }

                                // Save the appointment data in Firestore
                                try {
                                    const docRef = await addDoc(collection(db, "appointments"), appointmentData);
                                    console.log("Document written with ID: ", docRef.id);
                                } catch (e) {
                                    console.error("Error adding document: ", e);
                                }

                                Alert.alert('NICE', 'SCHEDULED! Navigate to Bookings to view your appointment.');
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