import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { fetchUrls } from '../firebase.js';
import * as WebBrowser from 'expo-web-browser';

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
    <>
      {urls.map((url, index) => (
        <TouchableOpacity key={index} onPress={() => openPDF(url)}>
          <Text>Open PDF {index + 1}</Text>
        </TouchableOpacity>
      ))}
    </>
  );
};

export default Scripts;