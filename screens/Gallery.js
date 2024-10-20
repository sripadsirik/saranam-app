import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  getMetadata,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../firebase'; // Adjust the path as needed
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import * as ImageManipulator from 'expo-image-manipulator'; // Import ImageManipulator

const Gallery = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // State for full-screen modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      const storageRef = ref(storage, 'gallery/');
      const result = await listAll(storageRef);

      if (result.items.length === 0) {
        console.warn('No files found in the gallery folder.');
        setMediaFiles([]);
        setLoading(false);
        return;
      }

      const mediaPromises = result.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        const metadata = await getMetadata(itemRef);

        return {
          url: url,
          contentType: metadata.contentType,
          fullPath: itemRef.fullPath, // Add fullPath to each media item
        };
      });

      const mediaItems = await Promise.all(mediaPromises);
      setMediaFiles(mediaItems);
    } catch (error) {
      console.error('Error fetching media files:', error);
      Alert.alert(
        'Error',
        'An error occurred while fetching media files. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Permission to access media library is required!'
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false, // Prevent automatic conversion
      quality: undefined, // Prevent automatic conversion
    });

    console.log('ImagePicker result:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      console.log('Selected asset:', asset);

      setUploading(true);
      let fileUri = asset.uri;
      let mimeType = asset.mimeType;
      let fileExtension = asset.fileName
        ? asset.fileName.split('.').pop().toLowerCase()
        : '';

      // Log the mimeType and fileExtension
      console.log('Asset mimeType:', mimeType);
      console.log('Asset fileExtension:', fileExtension);

      const heifTypes = ['heic', 'heif'];
      const isHeif = heifTypes.includes(fileExtension);

      if (asset.type.startsWith('image') && isHeif) {
        try {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            fileUri,
            [],
            { format: ImageManipulator.SaveFormat.JPEG }
          );
          fileUri = manipulatedImage.uri;
          mimeType = 'image/jpeg';
          fileExtension = 'jpg';
          console.log('Converted HEIF image to JPEG:', manipulatedImage);
        } catch (error) {
          console.error('Error converting HEIF image:', error);
          setUploading(false);
          Alert.alert('Conversion failed', 'Failed to convert HEIF image to JPEG.');
          return;
        }
      }

      const fileName = `image_${Date.now()}.${fileExtension}`;

      // Fetch the file
      let blob;
      try {
        const response = await fetch(fileUri);
        blob = await response.blob();
      } catch (error) {
        console.error('Error fetching the file:', error);
        setUploading(false);
        Alert.alert('Error', 'Failed to read the selected file.');
        return;
      }

      const metadata = {
        contentType: mimeType,
      };

      const storageRef = ref(storage, `gallery/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, blob, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.error('Upload error:', error);
          setUploading(false);
          Alert.alert('Upload failed', error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUploading(false);
            fetchMediaFiles();
          });
        }
      );
    } else {
      console.log('User cancelled image picker or no assets returned');
    }
  };

  const handleLongPress = (item) => {
    Alert.alert(
      'Delete Media',
      'Are you sure you want to delete this media?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteMedia(item),
        },
      ],
      { cancelable: true }
    );
  };

  const deleteMedia = async (item) => {
    try {
      const mediaRef = ref(storage, item.fullPath);
      await deleteObject(mediaRef);
      // Remove the item from the mediaFiles array
      setMediaFiles((prevMediaFiles) =>
        prevMediaFiles.filter((media) => media.url !== item.url)
      );
      Alert.alert('Deleted', 'Media has been deleted.');
    } catch (error) {
      console.error('Error deleting media:', error);
      Alert.alert('Error', 'Failed to delete media.');
    }
  };

  const renderMediaItem = ({ item }) => {
    const isImage = item.contentType && item.contentType.startsWith('image/');

    return (
      <TouchableOpacity
        style={styles.mediaItem}
        onPress={() => {
          setSelectedMedia(item);
          setModalVisible(true);
        }}
        onLongPress={() => handleLongPress(item)} // Add onLongPress handler
      >
        {isImage ? (
          <Image source={{ uri: item.url }} style={styles.mediaImage} />
        ) : (
          <Video
            source={{ uri: item.url }}
            style={styles.mediaImage}
            useNativeControls
            resizeMode="cover"
          />
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading media files...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <TouchableOpacity style={styles.uploadButton} onPress={uploadMedia}>
        <Text style={styles.uploadButtonText}>Upload Media</Text>
      </TouchableOpacity>

      {uploading && <ActivityIndicator size="large" color="#0000ff" />}

      {mediaFiles.length === 0 ? (
        <View style={styles.noMediaContainer}>
          <Text style={styles.noMediaText}>No media available.</Text>
        </View>
      ) : (
        <FlatList
          data={mediaFiles}
          renderItem={renderMediaItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
          style={styles.mediaList}
        />
      )}

      {/* Full-screen Modal */}
      {selectedMedia && (
        <Modal
          visible={modalVisible}
          transparent={false}
          onRequestClose={() => {
            setModalVisible(false);
            setSelectedMedia(null);
          }}
        >
          <View style={styles.modalContainer}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setModalVisible(false);
                setSelectedMedia(null);
              }}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
            {/* Display Image or Video */}
            {selectedMedia.contentType.startsWith('image/') ? (
              <Image
                source={{ uri: selectedMedia.url }}
                style={styles.fullScreenMedia}
                resizeMode="contain"
              />
            ) : (
              <Video
                source={{ uri: selectedMedia.url }}
                style={styles.fullScreenMedia}
                useNativeControls
                resizeMode="contain"
              />
            )}
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  uploadButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    margin: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  mediaList: {
    flex: 1,
  },
  mediaItem: {
    flex: 1 / 3, // For 3 columns
    margin: 2,
    height: 120,
  },
  mediaImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  noMediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMediaText: {
    fontSize: 18,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#000', // Black background for better visibility
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  fullScreenMedia: {
    width: '100%',
    height: '100%',
  },
});

export default Gallery;
