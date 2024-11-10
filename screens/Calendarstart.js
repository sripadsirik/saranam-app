import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Calendarstart = ({ navigation }) => {
    const [items, setItems] = useState({});
    const [currentWeek, setCurrentWeek] = useState({});

    useEffect(() => {
        const fetchData = async (startOfWeek, endOfWeek) => {
            const query = collection(db, 'appointments');
            const unsubscribe = onSnapshot(query, async (querySnapshot) => {
                let data = {};
                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    const doc = querySnapshot.docs[i];
                    const appointmentData = doc.data();
                    const appointmentDate = new Date(appointmentData.Day.seconds * 1000);
                    appointmentDate.setHours(0, 0, 0, 0);
                    if (appointmentDate < new Date()) {
                        await deleteDoc(doc.ref);
                    } else if (appointmentDate >= startOfWeek && appointmentDate <= endOfWeek) {
                        const date = appointmentDate.toISOString().split('T')[0];
                        if (!data[date]) {
                            data[date] = [];
                        }
                        data[date].push({
                            ...appointmentData,
                            formattedDate: new Intl.DateTimeFormat('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            }).format(appointmentDate)
                        });
                    }
                }
                setItems(data);
            });
            return () => unsubscribe();
        };

        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));
        setCurrentWeek({ startOfWeek, endOfWeek });
        fetchData(startOfWeek, endOfWeek);
    }, []);

    const handleDayChange = (day) => {
        const selectedDate = new Date(day.timestamp);
        const startOfWeek = new Date(selectedDate.setDate(selectedDate.getDate() - selectedDate.getDay()));
        const endOfWeek = new Date(selectedDate.setDate(startOfWeek.getDate() + 6));
        if (startOfWeek.getTime() !== currentWeek.startOfWeek.getTime()) {
            setCurrentWeek({ startOfWeek, endOfWeek });
            fetchData(startOfWeek, endOfWeek);
        }
    };

    const renderItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.dateText}>{item.formattedDate}</Text>
                <Text>Name: {item.fullName}</Text>
                <Text>Family Name: {item.familyName}</Text>
                <Text>Phone Number: {item.phoneNumber}</Text>
                <Text>Pooja Type: {item.name}</Text>
                <Text>Address: {item.address}</Text>
            </View>
        );
    };

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
                onDayChange={handleDayChange}
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
    dateText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
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
