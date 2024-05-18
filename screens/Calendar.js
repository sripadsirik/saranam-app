import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { onSnapshot } from 'firebase/firestore';


const Calendar = () => {
    const [items, setItems] = useState({});

    useEffect(() => {
        const fetchData = () => {
            const query = collection(db, 'appointments');
            const unsubscribe = onSnapshot(query, (querySnapshot) => {
                let data = {}; // Clear out the data object
                querySnapshot.forEach((doc) => {
                    const appointmentData = doc.data();
                    const date = new Date(appointmentData.Day.seconds * 1000).toISOString().split('T')[0];
                    if (!data[date]) {
                        data[date] = [];
                    }
                    data[date].push(appointmentData);
                });
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
                <Text>Message: {item.note}</Text>
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