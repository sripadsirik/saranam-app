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
  deleteObject,
} from 'firebase/storage';
import { storage, db } from '../firebase'; // Adjust the path as needed
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import * as ImageManipulator from 'expo-image-manipulator'; // Import ImageManipulator
import { collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

const Gallery = () => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // State for full-screen modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  // State for selection mode and selected items
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  // State for upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'gallery'), (snapshot) => {
      const mediaItems = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      // Sort mediaItems by timestamp descending if you want the latest first
      mediaItems.sort((a, b) => b.timestamp - a.timestamp);
      setMediaFiles(mediaItems);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

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
      allowsMultipleSelection: true, // Enable multiple selection
      selectionLimit: 13, // Limit to 20 files
    });

    console.log('ImagePicker result:', result);

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setUploading(true);
      setTotalFiles(result.assets.length);
      setUploadProgress(0);

      // Process each selected asset
      const uploadPromises = result.assets.map(async (asset) => {
        console.log('Selected asset:', asset);

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
            Alert.alert('Conversion failed', 'Failed to convert HEIF image to JPEG.');
            return;
          }
        }

        const fileName = `image_${Date.now()}_${Math.floor(
          Math.random() * 10000
        )}.${fileExtension}`;

        // Fetch the file
        let blob;
        try {
          const response = await fetch(fileUri);
          blob = await response.blob();
        } catch (error) {
          console.error('Error fetching the file:', error);
          Alert.alert('Error', 'Failed to read the selected file.');
          return;
        }

        const metadata = {
          contentType: mimeType,
        };

        const storageRef = ref(storage, `gallery/${fileName}`);

        // Upload the file
        return uploadBytesResumable(storageRef, blob, metadata)
          .then((snapshot) => {
            console.log('Uploaded:', fileName);
            return getDownloadURL(snapshot.ref).then((downloadURL) => {
              // Add metadata to Firestore
              return addDoc(collection(db, 'gallery'), {
                url: downloadURL,
                contentType: mimeType,
                fullPath: snapshot.ref.fullPath,
                name: snapshot.ref.name,
                timestamp: Date.now(),
              });
            });
          })
          .then(() => {
            setUploadProgress((prev) => prev + 1);
          })
          .catch((error) => {
            console.error('Upload error:', error);
            Alert.alert('Upload failed', error.message);
          });
      });

      // Wait for all uploads to finish
      Promise.all(uploadPromises)
        .then(() => {
          console.log('All uploads completed');
        })
        .finally(() => {
          setUploading(false);
        });
    } else {
      console.log('User cancelled image picker or no assets returned');
    }
  };

  const handleLongPress = (item) => {
    if (selectionMode) {
      handleSelectItem(item);
    } else {
      setSelectionMode(true);
      setSelectedItems([item]);
    }
  };

  const handleSelectItem = (item) => {
    if (selectedItems.some((i) => i.id === item.id)) {
      // Deselect item
      setSelectedItems(selectedItems.filter((i) => i.id !== item.id));
    } else {
      // Select item
      setSelectedItems([...selectedItems, item]);
    }
  };

  const cancelSelectionMode = () => {
    setSelectionMode(false);
    setSelectedItems([]);
  };

  const deleteSelectedItems = async () => {
    Alert.alert(
      'Delete Media',
      `Are you sure you want to delete ${selectedItems.length} item(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // Delete each selected item
              const deletePromises = selectedItems.map(async (item) => {
                const mediaRef = ref(storage, item.fullPath);
                await deleteObject(mediaRef);
                // Remove from Firestore
                await deleteDoc(doc(db, 'gallery', item.id));
              });

              await Promise.all(deletePromises);

              Alert.alert('Deleted', 'Selected media has been deleted.');
            } catch (error) {
              console.error('Error deleting media:', error);
              Alert.alert('Error', 'Failed to delete media.');
            } finally {
              cancelSelectionMode();
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderMediaItem = ({ item }) => {
    const isImage = item.contentType && item.contentType.startsWith('image/');
    const isSelected = selectedItems.some((i) => i.id === item.id);

    return (
      <TouchableOpacity
        style={[styles.mediaItem, isSelected && styles.selectedItem]}
        onPress={() => {
          if (selectionMode) {
            handleSelectItem(item);
          } else {
            setSelectedMedia(item);
            setModalVisible(true);
          }
        }}
        onLongPress={() => handleLongPress(item)}
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
        {selectionMode && (
          <View style={styles.checkmarkContainer}>
            {isSelected ? (
              <Text style={styles.checkmark}>✓</Text>
            ) : (
              <View style={styles.uncheckedCircle} />
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with buttons */}
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <View style={styles.header}>
        {selectionMode ? (
          <>
            <TouchableOpacity onPress={cancelSelectionMode}>
              <Text style={styles.headerButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{selectedItems.length} Selected</Text>
            <TouchableOpacity onPress={deleteSelectedItems}>
              <Text style={[styles.headerButtonText, { color: 'red' }]}>Delete</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={{ width: 60 }} />
            <Text style={styles.headerTitle}>Gallery</Text>
            <TouchableOpacity onPress={() => setSelectionMode(true)}>
              <Text style={styles.headerButtonText}>Select</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.uploadButton} onPress={uploadMedia}>
        <Text style={styles.uploadButtonText}>Upload Media</Text>
      </TouchableOpacity>

      {uploading && (
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.uploadingText}>
            Uploading files... {uploadProgress}/{totalFiles}
          </Text>
        </View>
      )}

      {mediaFiles.length === 0 ? (
        <View style={styles.noMediaContainer}>
          <Text style={styles.noMediaText}>No media available.</Text>
        </View>
      ) : (
        <FlatList
          data={mediaFiles}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id}
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
  // ... (styles remain the same as your previous code)
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  uploadButton: {
    backgroundColor: '#000000',
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  mediaList: {
    flex: 1,
  },
  mediaItem: {
    flex: 1 / 3, // For 3 columns
    margin: 1,
    height: 120,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  selectedItem: {
    opacity: 0.8,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
    padding: 2,
  },
  checkmark: {
    fontSize: 16,
    color: 'green',
  },
  uncheckedCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'gray',
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
  // Uploading styles
  uploadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  uploadingText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
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
  // Header styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerButtonText: {
    fontSize: 16,
    color: '#1e90ff',
    width: 60,
    textAlign: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Gallery;
