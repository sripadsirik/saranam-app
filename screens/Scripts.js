import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { fetchUrls } from '../firebase.js';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';
import { Line } from '../components/styles.js';

import{
    StyledContainer,
    InnerContainer,
    PageLogo,
    PageTitle,
    SubTitle,
    Colors,
    TextLink,
    TextLinkContent
}from './../components/stylesl';
import { MsgBox, ItemBox } from '../components/styles';

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
      <SubTitle style={styles.text1}>Ayappa Songs Lyrics</SubTitle>
      <View style={styles.row}>
        {urls.map((item, index) => {
          // Remove .pdf extension from the name
          const nameWithoutExtension = item.name.replace('.pdf', '');
  
          return (
            <TouchableOpacity key={index} style={styles.box} onPress={() => openPDF(item.url)}>
              <MsgBox style={styles.text}>{nameWithoutExtension}</MsgBox>
            </TouchableOpacity>
          );
        })}
      </View>
      <Line />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      marginTop: 50,
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
    text1: {
        textAlign: 'center',
        fontSize: 20,
    },
  });
  
  export default Scripts;