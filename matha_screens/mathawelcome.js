import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const mathawelcome = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to the Matha Home Screen!</Text>
            {/* Add your content here */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
});

export default mathawelcome;