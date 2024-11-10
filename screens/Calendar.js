import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Animated, Easing } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { collection, onSnapshot, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const Calendarstart = ({ navigation }) => {
    const [items, setItems] = useState({});
    const colorAnimation = useState(new Animated.Value(0))[0];

    useEffect(() => {
        const fetchData = async () => {
            const query = collection(db, 'appointments');
            const unsubscribe = onSnapshot(query, async (querySnapshot) => {
                let data = {};
                const currentDate = new Date();
                currentDate.setHours(0, 0, 0, 0);
                for (let i = 0; i < querySnapshot.docs.length; i++) {
                    const doc = querySnapshot.docs[i];
                    const appointmentData = doc.data();
                    const appointmentDate = new Date(appointmentData.Day.seconds * 1000);
                    appointmentDate.setHours(0, 0, 0, 0);
                    if (appointmentDate < currentDate) {
                        await deleteDoc(doc.ref);
                    } else {
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
        fetchData();
    }, []);

    useEffect(() => {
        colorAnimation.setValue(0);
        Animated.loop(
            Animated.sequence([
                Animated.timing(colorAnimation, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(colorAnimation, {
                    toValue: 2,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(colorAnimation, {
                    toValue: 3,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
                Animated.timing(colorAnimation, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.linear,
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [colorAnimation]);

    const interpolatedColor = colorAnimation.interpolate({
        inputRange: [0, 1, 2, 3],
        outputRange: ['purple', 'gold', 'blue', 'red'],
    });

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
            <Animated.View style={[styles.animatedHeader, { backgroundColor: interpolatedColor }]}>
                <Text> </Text>
                <Text> </Text>
                <Text> </Text>
                <Text style={styles.animatedHeaderText}>Weekly Agenda</Text>
            </Animated.View>
            <Agenda
                items={items}
                renderItem={renderItem}
                renderEmptyData={renderEmptyData}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    animatedHeader: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    animatedHeaderText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
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
