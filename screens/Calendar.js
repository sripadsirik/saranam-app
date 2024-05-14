import React, {useState} from 'react';
import {View, Text} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {ScrollView} from "react-native";
import { Agenda } from 'react-native-calendars';

// import{

//     InnerContainer,
//     PageLogo,
//     PageTitle,
//     SubTitle,
//     StyledFormArea,
//     StyledButton,
//     ButtonText,
//     Line,
//     WelcomeContainer,
//     WelcomeImage,
//     Avatar,
//     StyledContainer
// }from './../components/stylesw';

const Calendar = () => {
    const [hidePassword, setHidePassword] = useState(true); 

    // Define items
    const [items, setItems] = useState({
        '2022-05-22': [{text: 'item 1 - any js object'}],
        '2022-05-23': [{text: 'item 2 - any js object'}, {text: 'any js object'}]
    });

    const loadItems = (day) => {
        setTimeout(() => {
            const newItems = {};
            setItems(newItems);
        }, 1000);
    };

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    const day = String(currentDate.getDate()).padStart(2, '0');
    const selectedDate = `${year}-${month}-${day}`;

    // Define renderItem
    const renderItem = (item) => {
        return (
            <View style={{backgroundColor: 'white', padding: 20, marginRight: 10, marginTop: 17}}>
                <Text>{item.name}</Text>
            </View>
        );
    };

    return(
        <View style={{ flex: 1 }}>
            <Agenda
                items={items}
                loadItemsForMonth={loadItems}
                selected={selectedDate} // Set the initially selected day to the current date
                renderItem={renderItem}
            />
        </View>
    );
};



export default Calendar;