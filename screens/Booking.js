import { React, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button, StatusBar } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import { getFirestore, collection, query, where, onSnapshot, doc, deleteDoc, getDocs, updateDoc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Alert } from 'react-native';

import {
    InnerContainer,
    PageTitle,
    Line,
    StyledContainer
} from '../components/stylesw';
import { MsgBox } from '../components/styles';

const Booking = ({navigation}) => {
    const [appointments, setAppointments] = useState([]);
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;
    const [familyName, setFamilyName] = useState(null);

    // Fetch the family name in real-time for the user
    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "families"), where("members", "array-contains", user.email)),
            (snapshot) => {
                if (!snapshot.empty) {
                    const familyDoc = snapshot.docs[0];
                    setFamilyName(familyDoc.id);
                } else {
                    setFamilyName(null);
                }
            }
        );
        return () => unsubscribe();
    }, [user.email]);

    // Fetch appointments based on the family in real-time
    useEffect(() => {
        if (familyName) {
            const unsubscribe = onSnapshot(
                query(collection(db, "appointments"), where("familyName", "==", familyName)),
                (snapshot) => {
                    const newAppointments = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setAppointments(newAppointments);
                }
            );
            return () => unsubscribe();
        } else {
            setAppointments([]); // Clear appointments if no family is selected
        }
    }, [familyName]);

    const handleDelete = async (index) => {
        const appointmentId = appointments[index].id;
        try {
            await deleteDoc(doc(db, 'appointments', appointmentId));
            Alert.alert('Success', 'Appointment deleted successfully!');
            navigation.navigate('Schedule');
        } catch (error) {
            console.error("Error removing document: ", error);
            Alert.alert('Error', 'Error deleting appointment!');
        }
    };

    // Deleting the entire family along with its appointments
    const handleDeleteFamily = async () => {
        if (familyName) {
            try {
                // Query all bookings tied to this family
                const bookingsQuery = query(collection(db, "appointments"), where("familyName", "==", familyName));
                const bookingsSnapshot = await getDocs(bookingsQuery);

                // Delete all bookings for the family
                const deletePromises = bookingsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
                await Promise.all(deletePromises);

                // Now delete the family document itself
                const familyDocRef = doc(db, "families", familyName);
                await deleteDoc(familyDocRef);

                // Reset state
                setFamilyName(null);
                setAppointments([]);  // Clear appointments from view
                Alert.alert("Family Deleted", "The family and associated appointments have been deleted.");
            } catch (error) {
                console.error("Error deleting family:", error);
                Alert.alert("Error", "There was an error deleting the family.");
            }
        }
    };

    // Resetting the family for the user
    const handleResetFamily = async () => {
        if (familyName) {
            try {
                const familyDocRef = doc(db, "families", familyName);
                const familyDoc = await getDoc(familyDocRef);

                if (familyDoc.exists()) {
                    const updatedMembers = familyDoc.data().members.filter(member => member !== user.email);

                    // Remove the user from the family
                    await updateDoc(familyDocRef, { members: updatedMembers });

                    // Reset state
                    setFamilyName(null);
                    setAppointments([]);  // Clear appointments from view
                    Alert.alert("Family Reset", "You have been removed from the family.");
                } else {
                    Alert.alert("No Family", "Family document does not exist.");
                }
            } catch (error) {
                console.error("Error resetting family:", error);
                Alert.alert("Error", "There was an error removing you from the family.");
            }
        }
    };

    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle>My Pooja Time</PageTitle>
                    <Line />
                    <MsgBox> Only one booking is allowed. To schedule another (if you mis-scheduled it), please delete the existing appointment below. </MsgBox>
                    <Line />
                    <View style={styles.container}>
                        {appointments.map((appointment, index) => (
                            <View key={index} style={styles.itemBox}>
                                <Text style={styles.itemText}>Name:  {appointment.fullName}</Text>
                                <Text> </Text>
                                <Text style={styles.itemText}>Phone Number: {appointment.phoneNumber}</Text>
                                <Text> </Text>
                                <Text style={styles.itemText}>Pooja Type: {appointment.name}</Text>
                                <Text> </Text>
                                <Text style={styles.itemText}>Address: {appointment.address}</Text>
                                <Text> </Text>
                                <Text style={styles.itemText}>Day: {appointment.Day.toDate().toLocaleDateString('en-US', { timeZone: timeZone, weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                                <Text> </Text>
                                <Text style={styles.itemText}>Family Name: {appointment.familyName}</Text>
                                <Text> </Text>
                                <TouchableOpacity onPress={() => handleDelete(index)}>
                                    <Icon name="trash" size={30} color="#900" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    itemBox: {
        borderWidth: 0,
        borderColor: '#000',
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#ffe',
        shadowColor: "#ffbf00",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 15.84,
        elevation: 5,
    },
    itemText: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
});

export default Booking;
