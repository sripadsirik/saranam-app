import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { fetchUrls } from '../firebase.js';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';
import { Line } from '../components/styles.js';

const Scripts = () => {
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    async function useUrls() {
        try {
          const urls = await fetchUrls();
          console.log(urls);
          setUrls(urls);
        } catch (error) {
          console.error(error);
        }
    }

    useUrls();
  }, []);

  const openPDF = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={styles.container}>
      <Text>Ayappa Songs Lyrics</Text>
      <View style={styles.row}>
        {urls.map((item, index) => (
          <TouchableOpacity key={index} style={styles.box} onPress={() => openPDF(item.url)}>
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Line />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    row: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    box: {
      width: '30%',
      height: 100,
      margin: 5,
      backgroundColor: '#ddd',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      textAlign: 'center',
    },
  });
  
  export default Scripts;