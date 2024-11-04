import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Calendar = () => {
    const [items, setItems] = useState({});
    const [filteredItems, setFilteredItems] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const query = collection(db, 'appointments');
            const unsubscribe = onSnapshot(query, async (querySnapshot) => {
                let data = {};
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 for accurate comparison

                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    const doc = querySnapshot.docs[i];
                    const appointmentData = doc.data();
                    const appointmentDate = new Date(appointmentData.Day.seconds * 1000);
                    appointmentDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 for accurate comparison

                    if (appointmentDate < currentDate) {
                        // If the appointment date is before today, delete the document
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

    // Filter only the selected date items
    const handleDayPress = (day) => {
        const dateString = day.dateString;
        setSelectedDate(dateString);

        if (items[dateString]) {
            // Only keep the items for the selected date
            setFilteredItems({ [dateString]: items[dateString] });
        } else {
            // If no appointments for the selected date, clear out the filteredItems
            setFilteredItems({});
        }
    };

    // Custom header for showing month below the day
    const renderDayHeader = (date) => {
        if (!date) return null;
        const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
        const day = new Date(date).getDate();
        const month = new Date(date).toLocaleDateString('en-US', { month: 'short' });
        return (
            <View style={styles.dateHeader}>
                <Text style={styles.dayText}>{`${day} ${dayName}`}</Text>
                <Text style={styles.monthText}>{month}</Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <Agenda
                items={filteredItems}  // Pass the strictly filtered items
                renderItem={renderItem}
                renderEmptyData={renderEmptyData}
                onDayPress={handleDayPress}
                selected={selectedDate}
                renderDay={(date) => renderDayHeader(date)} // Custom day header
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
    dateHeader: {
        alignItems: 'center',
        marginVertical: 10,
    },
    dayText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    monthText: {
        fontSize: 14,
        color: 'gray',
    },
});

export default Calendar;
