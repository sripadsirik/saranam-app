


import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Calendarstart = ({ navigation }) => {
    const [items, setItems] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const query = collection(db, 'appointments');
            const unsubscribe = onSnapshot(query, async (querySnapshot) => {
                let data = {}; // Clear out the data object
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for accurate comparison

                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    const doc = querySnapshot.docs[i];
                    const appointmentData = doc.data();
                    const appointmentDate = new Date(appointmentData.Day.seconds * 1000);
                    appointmentDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00 for accurate comparison

                    if (appointmentDate < currentDate) {
                        // If the appointment date is before the current date, delete the document
                        await deleteDoc(doc.ref);
                    } else {
                        const date = appointmentDate.toISOString().split('T')[0];
                        if (!data[date]) {
                            data[date] = [];
                        }
                        data[date].push(appointmentData);
                    }
                }
                setItems(data);
            });

            return () => unsubscribe();
        };
        fetchData();
    }, []);

    const renderItem = (item) => {
        return (
            <View style={styles.item}>
                <Text>Name: {item.fullName}</Text>
                <Text>Family Name: {item.familyName}</Text>
                <Text>Phone Number: {item.phoneNumber}</Text>
                <Text>Pooja Type: {item.name}</Text>
                <Text>Address: {item.address}</Text>
            </View>
        );
    };

    // Custom view when there are no appointments
    const renderEmptyData = () => {
        return (
            <View style={styles.emptyData}>
                <Text style={styles.noAppointmentsText}>No appointments available on this day. Use dropdown to see if there are any.</Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.buttonContainer}>
                <Text> </Text>
                <Text> </Text>
                <Button title="Back to Start" onPress={() => navigation.navigate('Start')} />
            </View>
            <Agenda
                items={items}
                renderItem={renderItem}
                renderEmptyData={renderEmptyData}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        backgroundColor: 'white',
        padding: 20,
        marginRight: 10,
        marginTop: 17,
    },
    emptyData: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },
    noAppointmentsText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonContainer: {
        marginTop: 20,
        paddingHorizontal: 20,
    },
});

export default Calendarstart;
