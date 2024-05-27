import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { fetchUrls, fetchGaneshaUrls, fetchSaiUrls, fetchDeviUrls, fetchVishnuUrls, fetchShivaUrls } from '../firebase.js';
import * as WebBrowser from 'expo-web-browser';
import { StyleSheet, View } from 'react-native';
import { Line } from '../components/styles.js';
import { ScrollView } from 'react-native';

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
  const [ganeshaUrls, setGaneshaUrls] = useState([]);
  const [saiUrls, setSaiUrls] = useState([]);
  const [deviUrls, setDeviUrls] = useState([]);
  const [vishnuUrls, setVishnuUrls] = useState([]);
  const [shivaUrls, setShivaUrls] = useState([]);


  useEffect(() => {
    async function useUrls() {
        try {
          const urls = await fetchUrls();
          console.log(urls);
          setUrls(urls);
        } catch (error) {
          console.error(error);
        }

        try {
          const ganeshaUrls = await fetchGaneshaUrls();
          console.log(ganeshaUrls);
          setGaneshaUrls(ganeshaUrls);
        } catch (error) {
          console.error(error);
        }

        try {
          const saiUrls = await fetchSaiUrls();
          console.log(saiUrls);
          setSaiUrls(saiUrls);
        } catch (error) {
          console.error(error);
        }

        try {
          const deviUrls = await fetchDeviUrls();
          console.log(deviUrls);
          setDeviUrls(deviUrls);
        } catch (error) {
          console.error(error);
        }

        try {
          const vishnuUrls = await fetchVishnuUrls();
          console.log(vishnuUrls);
          setVishnuUrls(vishnuUrls);
        } catch (error) {
          console.error(error);
        }

        try {
          const shivaUrls = await fetchShivaUrls();
          console.log(shivaUrls);
          setShivaUrls(shivaUrls);
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
        <ScrollView>
            <View style={styles.container}>
            <SubTitle style={styles.text1}>Ayappa Songs Lyrics</SubTitle>
            <View style={styles.row}>
                {urls.map((item, index) => {
                  const nameWithoutExtension = item.name.replace('.pdf', '');
          
                  return (
                      <TouchableOpacity key={index} style={styles.box} onPress={() => openPDF(item.url)}>
                      <MsgBox style={styles.text}>{nameWithoutExtension}</MsgBox>
                      </TouchableOpacity>
                  );
                })}
            </View>
            <Line />
            

            <SubTitle style={styles.text1}>Ganesha Songs Lyrics</SubTitle>
            <View style={styles.row}>
                {ganeshaUrls.map((item, index) => {
                  const nameWithoutExtension = item.name.replace('.pdf', '');
        
                  return (
                    <TouchableOpacity key={index} style={styles.box} onPress={() => openPDF(item.url)}>
                      <MsgBox style={styles.text}>{nameWithoutExtension}</MsgBox>
                    </TouchableOpacity>
                  );
                })}
            </View>
            <Line />


            <SubTitle style={styles.text1}>Saibaba Songs Lyrics</SubTitle>
            <View style={styles.row}>
                {saiUrls.map((item, index) => {
                  const nameWithoutExtension = item.name.replace('.pdf', '');
          
                  return (
                      <TouchableOpacity key={index} style={styles.box} onPress={() => openPDF(item.url)}>
                      <MsgBox style={styles.text}>{nameWithoutExtension}</MsgBox>
                      </TouchableOpacity>
                  );
                })}
            </View>
            <Line />


            <SubTitle style={styles.text1}>Devi Songs Lyrics</SubTitle>
            <View style={styles.row}>
                {deviUrls.map((item, index) => {
                  const nameWithoutExtension = item.name.replace('.pdf', '');
          
                  return (
                      <TouchableOpacity key={index} style={styles.box} onPress={() => openPDF(item.url)}>
                      <MsgBox style={styles.text}>{nameWithoutExtension}</MsgBox>
                      </TouchableOpacity>
                  );
                })}
            </View>
            <Line />

            
            <SubTitle style={styles.text1}>Vishnu Songs Lyrics</SubTitle>
            <View style={styles.row}>
                {vishnuUrls.map((item, index) => {
                  const nameWithoutExtension = item.name.replace('.pdf', '');
          
                  return (
                      <TouchableOpacity key={index} style={styles.box} onPress={() => openPDF(item.url)}>
                      <MsgBox style={styles.text}>{nameWithoutExtension}</MsgBox>
                      </TouchableOpacity>
                  );
                })}
            </View>
            <Line />
            

            <SubTitle style={styles.text1}>Shiva Songs Lyrics</SubTitle>
            <View style={styles.row}>
                {shivaUrls.map((item, index) => {
                  const nameWithoutExtension = item.name.replace('.pdf', '');
          
                  return (
                      <TouchableOpacity key={index} style={styles.box} onPress={() => openPDF(item.url)}>
                      <MsgBox style={styles.text}>{nameWithoutExtension}</MsgBox>
                      </TouchableOpacity>
                  );
                })}
            </View>
            <Line />
            

            <SubTitle style={styles.text1}>Murugan Songs Lyrics</SubTitle>
            <View style={styles.row}>
                {urls.map((item, index) => {
                  const nameWithoutExtension = item.name.replace('.pdf', '');
          
                  // return (
                  //     <TouchableOpacity key={index} style={styles.box} onPress={() => openPDF(item.url)}>
                  //     <MsgBox style={styles.text}>{nameWithoutExtension}</MsgBox>
                  //     </TouchableOpacity>
                  // );
                })}
            </View>
            <Line />


            <SubTitle style={styles.text1}>Hanuman Songs Lyrics</SubTitle>
            <View style={styles.row}>
                {urls.map((item, index) => {
                  const nameWithoutExtension = item.name.replace('.pdf', '');
          
                  // return (
                  //     <TouchableOpacity key={index} style={styles.box} onPress={() => openPDF(item.url)}>
                  //     <MsgBox style={styles.text}>{nameWithoutExtension}</MsgBox>
                  //     </TouchableOpacity>
                  // );
                })}
            </View>
            <Line />
            <Line />
            <Line />
            <Line />
            </View>
        </ScrollView>
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
        width: '28%',
        height: 100,
        margin: 5,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        borderColor: '#000',
        borderRadius: 10,
        padding: 0,
        marginHorizontal: '1%',
        marginBottom: 10,
        backgroundColor: '#ffe',
        shadowColor: "#ffbf00",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.8,
        shadowRadius: 15.84,
        elevation: 5,
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