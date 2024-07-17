import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { onSnapshot } from 'firebase/firestore';
import { deleteDoc, doc } from "firebase/firestore";


const Calendar = () => {
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
    
            // Clean up the listener when the component unmounts
            return () => unsubscribe();
        };
        fetchData();
    }, []);

    const renderItem = (item) => {
        return (
            <View style={{backgroundColor: 'white', padding: 20, marginRight: 10, marginTop: 17, zIndex: 1 }}>
                <Text>Name: {item.fullName}</Text>
                <Text>Phone Number: {item.phoneNumber}</Text>
                <Text>Pooja Type: {item.name}</Text>
                <Text>Address: {item.address}</Text>
            </View>
        );
    };

    return(
        <View style={{ flex: 1 }}>
            <Agenda
                items={items}
                renderItem={renderItem}
            />
        </View>
    );
};

export default Calendar;