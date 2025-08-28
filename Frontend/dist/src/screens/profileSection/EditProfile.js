import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import ContainerComponent from '../../components/commonComponents/Container';
import { userProfile } from '../../images';
import { SF, SH, SW } from '../../utils/dimensions';

const EditProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(userProfile);

  const handleSave = () => {
    console.log('Profile Saved', { name, email, phone, profileImage });
  };

  // Permission handler
  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      const permissionType =
        Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permissionType);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Camera permission (needed separately)
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  //Choose image source
  const chooseImage = () => {
    Alert.alert(
      'Select Option',
      'Choose a method to update your profile picture',
      [
        {
          text: 'Camera',
          onPress: async () => {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) return;
            launchCamera({ mediaType: 'photo' }, (response) => {
              if (response.assets && response.assets.length > 0) {
                setProfileImage({ uri: response.assets[0].uri });
              }
            });
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const hasPermission = await requestStoragePermission();
            if (!hasPermission) return;
            launchImageLibrary({ mediaType: 'photo' }, (response) => {
              if (response.assets && response.assets.length > 0) {
                setProfileImage({ uri: response.assets[0].uri });
              }
            });
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ContainerComponent>
      <ScrollView style={styles.container}>
        {/* Profile Image with Edit Icon */}
        <View style={styles.profileContainer}>
          <Image source={profileImage} style={styles.profileImage} />
          <TouchableOpacity style={styles.editIcon} onPress={chooseImage}>
            <MaterialIcons name="edit" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput value={name} onChangeText={setName} style={styles.input} 
          placeholder='Enter name'/>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            placeholder='Enter email address'
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            keyboardType="phone-pad"
            placeholder='Enter phone number'
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </ContainerComponent>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 30,
    justifyContent:'center'
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007bff',
  },
  editIcon: {
    position: 'absolute',
    bottom: SH(1),
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: SH(4),
    marginLeft:SW(60)
  },
  inputContainer: {
    marginBottom: SH(15),
  },
  label: {
    fontSize: SF(14),
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: SH(10),
    borderRadius: 8,
    fontSize: SF(15),
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: SH(10),
    borderRadius: 10,
    marginTop: SH(10),
  },
  saveText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: SF(15),
    fontWeight: '600',
  },
});
