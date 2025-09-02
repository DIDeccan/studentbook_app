import React, { useEffect, useState } from 'react';
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
import { SF, SH, SW } from '../../utils/dimensions';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '../../redux/reducer/profileReducer';

const EditProfile = () => {
  const dispatch = useDispatch()
  const getProfileData = useSelector((state)=> state.profile.getProfileData)
  const [name, setName] = useState(getProfileData?.first_name);
  const [email, setEmail] = useState(getProfileData?.email);
  const [phone, setPhone] = useState(getProfileData?.phone_number);
  const [profileImage, setProfileImage] = useState(null);
const[studentClass,setStudentClass] = useState(getProfileData?.student_class)
//console.log(getProfileData,"===========ger---------")


  useEffect(()=>{
    dispatch(getProfile())
  },[dispatch])

  useEffect(() => {
    if (getProfileData) {
      setName(getProfileData.first_name || '');
      setEmail(getProfileData.email || '');
      setPhone(getProfileData.phone_number || '');
      setProfileImage(getProfileData.profile_image || '');
      setStudentClass(getProfileData.student_class?.toString() || '');
    }
  }, [getProfileData]);

  const handleSave = async() => {
    console.log('Profile Saved', { name, email, phone, profileImage });
try {
    await dispatch(updateProfile({
      email,
      first_name: name,
      last_name: 'vasu',
      school: null,
      profile_image: profileImage, // must be handled as FormData in API call
      is_active: true,
      phone_number: phone,
      address: null,
      city: '',
      state: null,
      zip_code: '',
      user_type: 'student',
      student_class: studentClass,
      student_packages: []
    })).unwrap();
    // ✅ fetch profile only after successful update
    dispatch(getProfile());
  } catch (error) {
    console.log('Update failed:', error);
  }
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
               // setProfileImage({ uri: response.assets[0].uri });
                setProfileImage(response.assets[0].uri);
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
               // setProfileImage({ uri: response.assets[0].uri });
                 setProfileImage(response.assets[0].uri);
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

<Image
  source={{ uri: profileImage || 'https://static.vecteezy.com/system/resources/previews/058/338/462/non_2x/generic-profile-picture-placeholder-default-user-profile-image-vector.jpg' }}
  style={styles.profileImage}
/>
          {/* <Image source={{uri:getProfileData?.profile_image ? getProfileData.profile_image:'https://static.vecteezy.com/system/resources/previews/058/338/462/non_2x/generic-profile-picture-placeholder-default-user-profile-image-vector.jpg'}} resizeMode='cover' style={styles.profileImage} /> */}
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

          <View style={styles.inputContainer}>
          <Text style={styles.label}>Student Class</Text>
          <TextInput
            value={studentClass}
            onChangeText={(e)=> setStudentClass(e)}
            style={styles.input}
         //   keyboardType="phone-pad"
            placeholder='Enter class name'
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
    resizeMode:'cover'
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
