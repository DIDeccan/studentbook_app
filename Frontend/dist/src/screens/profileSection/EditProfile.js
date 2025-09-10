import React, { useEffect, useState, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import ContainerComponent from '../../components/commonComponents/Container';
import { SF, SH, SW } from '../../utils/dimensions';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, updateProfile } from '../../redux/reducer/profileReducer';

const EditProfile = () => {
  const dispatch = useDispatch();
  const getProfileData = useSelector((state) => state.profile.getProfileData);
  const { loading } = useSelector((state) => state.profile);

  // form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');

  // original snapshot (for comparisons)
  const [originalData, setOriginalData] = useState(null);

  // changed flags
  const [nameChanged, setNameChanged] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [phoneChanged, setPhoneChanged] = useState(false);

  // phone verification state
  const [phoneVerified, setPhoneVerified] = useState(true); // assumed verified from server initially
  const [verifying, setVerifying] = useState(false);

  // computed: whether Save should be enabled
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  // Fetch profile once and set original snapshot
  useEffect(() => {
    const fetch = async () => {
      await dispatch(getProfile({ student_id: 148, class_id: 2 }));
    };
    fetch();
  }, [dispatch]);

  // When profile arrives, initialize fields & reset flags
  useEffect(() => {
    if (!getProfileData) return;
    const orig = {
      first_name: getProfileData.first_name || '',
      email: getProfileData.email || '',
      phone_number: getProfileData.phone_number || '',
      profile_image: getProfileData.profile_image || '',
    };
    setOriginalData(orig);
    setName(orig.first_name);
    setEmail(orig.email);
    setPhone(orig.phone_number);
    setProfileImage(orig.profile_image);
    // reset change flags
    setNameChanged(false);
    setEmailChanged(false);
    setImageChanged(false);
    setPhoneChanged(false);
    setPhoneVerified(true); // server told us it was verified previously
    setIsSaveEnabled(false);
  }, [getProfileData]);

  // Helpers
  const normalize = (v) => (v === undefined || v === null ? '' : String(v));

  // Update change flags whenever fields update
  useEffect(() => {
    if (!originalData) return;

    const nameDiff = normalize(name) !== normalize(originalData.first_name);
    const emailDiff = normalize(email) !== normalize(originalData.email);
    const phoneDiff = normalize(phone) !== normalize(originalData.phone_number);

    // imageChanged is set at image pick time (we don't try to compare URIs)
    setNameChanged(nameDiff);
    setEmailChanged(emailDiff);
    setPhoneChanged(phoneDiff);

    // If user edits phone and it differs -> phone must be re-verified
    if (phoneDiff) {
      // On any phone change, require verification again
      setPhoneVerified(false);
    } else {
      // if phone matches original, then it's considered verified by server
      setPhoneVerified(true);
    }
  }, [name, email, phone, originalData]);

  // Compute whether Save should be enabled:
  // - If phone is changed and not verified -> disable save.
  // - Otherwise enable save if any of name/email/image/phone changed.
  useEffect(() => {
    const anyNonPhoneChange = nameChanged || emailChanged || imageChanged;
    if (phoneChanged && !phoneVerified) {
      setIsSaveEnabled(false);
      return;
    }
    // if phoneChanged but verified, it counts as a change that allows save
    const canSave = anyNonPhoneChange || phoneChanged;
    setIsSaveEnabled(Boolean(canSave));
  }, [nameChanged, emailChanged, imageChanged, phoneChanged, phoneVerified]);

  // Save handler (example - adapt FormData according to your API)
  const handleSave = async () => {
    try {
      // If your API expects FormData for images, build it. Otherwise adjust.
      const useFormData = imageChanged && profileImage && profileImage.startsWith('file');
      if (useFormData) {
        const formData = new FormData();
        formData.append('student_id', '148');
        formData.append('class_id', '2');
        formData.append('email', email);
        formData.append('first_name', name);
        formData.append('phone_number', phone);
        formData.append('profile_image', {
          uri: profileImage,
          name: 'profile.jpg',
          type: 'image/jpeg',
        });
        await dispatch(updateProfile(formData)).unwrap();
      } else {
        // plain object (API may accept URL/path or same key)
        await dispatch(
          updateProfile({
            student_id: 148,
            class_id: 2,
            email,
            first_name: name,
            phone_number: phone,
            profile_image: profileImage,
          })
        ).unwrap();
      }

      Alert.alert('Success', 'Profile updated successfully');
      // refresh profile and reset flags
      await dispatch(getProfile({ student_id: 148, class_id: 2 }));
    } catch (err) {
      console.log('Update failed:', err);
      Alert.alert('Error', 'Failed to update profile. Try again.');
    }
  };

  // Phone verify (mock: replace with actual API flow)
  const handleVerifyPhone = async () => {
    setVerifying(true);
    try {
      // put real verification flow here (send OTP, confirm etc.)
      // simulate success
      setTimeout(() => {
        setVerifying(false);
        setPhoneVerified(true);
        Alert.alert('Verified', 'Phone number verified successfully');
      }, 1200);
    } catch (e) {
      setVerifying(false);
      Alert.alert('Error', 'Verification failed');
    }
  };

  // Image pick
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
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const chooseImage = () => {
    Alert.alert('Select Option', 'Choose a method to update your profile picture', [
      {
        text: 'Camera',
        onPress: async () => {
          const hasPermission = await requestCameraPermission();
          if (!hasPermission) return;
          launchCamera({ mediaType: 'photo' }, (response) => {
            if (response?.assets?.length) {
              const uri = response.assets[0].uri;
            //  setProfileImage(uri);
              setProfileImage(response.assets[0].uri);
              setImageChanged(true);
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
            if (response?.assets?.length) {
              const uri = response.assets[0].uri;
            //  setProfileImage(uri);
              setProfileImage(response.assets[0].uri);
              setImageChanged(true);
            }
          });
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // UI
  return (
    <ContainerComponent>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      )}

      <ScrollView style={styles.container}>
        <View style={styles.profileContainer}>
          <Image
            source={{
              uri: `http://192.168.0.19:8000/${profileImage}`
               
                || 'https://static.vecteezy.com/system/resources/previews/058/338/462/non_2x/generic-profile-picture-placeholder-default-user-profile-image-vector.jpg',
            }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editIcon} onPress={chooseImage}>
            <MaterialIcons name="edit" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Enter name"
            // if you actually want the name input to get focus automatically add: autoFocus
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            placeholder="Enter email address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone</Text>
          <View style={styles.phoneRow}>
            <TextInput
              value={phone}
              onChangeText={(t) => setPhone(t)}
              style={[styles.input, { flex: 1 }]}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
            />
            {!phoneVerified ? (
              verifying ? (
                <ActivityIndicator size="small" color="#007bff" style={{ marginLeft: 8 }} />
              ) : (
                <TouchableOpacity onPress={handleVerifyPhone}>
                  <Text style={styles.verifyText}>Verify</Text>
                </TouchableOpacity>
              )
            ) : (
              <Text style={styles.verifiedTick}>✔</Text>
            )}
          </View>
          {phoneChanged && !phoneVerified && (
            <Text style={styles.verifyWarning}>Phone changed — please verify to save</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.saveButton, !isSaveEnabled && { backgroundColor: '#ccc' }]}
          disabled={!isSaveEnabled}
          onPress={handleSave}
        >
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
    justifyContent: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#007bff',
    resizeMode: 'cover',
  },
  editIcon: {
    position: 'absolute',
    bottom: SH(1),
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: SH(4),
    marginLeft: SW(60),
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
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verifyText: {
    color: '#007bff',
    fontWeight: '600',
    marginLeft: 8,
  },
  verifiedTick: {
    marginLeft: 8,
    fontSize: 18,
    color: 'green',
  },
  verifyWarning: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});
