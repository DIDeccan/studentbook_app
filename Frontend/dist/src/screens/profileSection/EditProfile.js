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
  Modal,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import ContainerComponent from '../../components/commonComponents/Container';
import { SF, SH, SW } from '../../utils/dimensions';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile, SendOtpUpdatePhoneNumber, updateProfile, VerifyUpdatePhoneNumber } from '../../redux/reducer/profileReducer';
import { baseURL } from '../../utils/config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from 'react-native-vector-icons/Entypo';
import OTPInput from '../../components/commonComponents/OTPInput';
import { color } from 'react-native-elements/dist/helpers';
import Colors, { darkColors, lightColors } from '../../utils/Colors';
import Toast from 'react-native-toast-message';

const EditProfile = () => {
  const themeMode = useSelector((state) => state.theme.theme);
  let colors = (themeMode === 'dark') ? darkColors : lightColors;
  const styles = themedStyles(colors);
  const dispatch = useDispatch();
  const getProfileData = useSelector((state) => state.profile.getProfileData);
  const { loading } = useSelector((state) => state.profile);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState(getProfileData?.profile_image);
  const [studentId, setStudentID] = useState('')
  const [classIs, setClassId] = useState('')
  const [originalData, setOriginalData] = useState(null);
  const [nameChanged, setNameChanged] = useState(false);
  const [emailChanged, setEmailChanged] = useState(false);
  const [imageChanged, setImageChanged] = useState(false);
  const [phoneChanged, setPhoneChanged] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  useEffect(() => {
    const fetch = async () => {
      let studentId = await AsyncStorage.getItem('studentId')
      let classId = await AsyncStorage.getItem('classId')
      setClassId(studentId)
      setClassId(classId)
      dispatch(getProfile({ student_id: studentId, class_id: classId }))
    };
    fetch();
  }, [dispatch]);

  useEffect(() => {
    if (!getProfileData) return;
    const orig = {
      first_name: getProfileData?.first_name || '',
      email: getProfileData?.email || '',
      phone_number: getProfileData?.phone_number || '',
      profile_image: getProfileData?.profile_image || null,
    };
    setOriginalData(orig);
    setName(orig.first_name);
    setEmail(orig.email);
    setPhone(orig.phone_number);
    setProfileImage(orig.profile_image);
    setNameChanged(false);
    setEmailChanged(false);
    setImageChanged(false);
    setPhoneChanged(false);
    setPhoneVerified(true);
    setIsSaveEnabled(false);
  }, [getProfileData]);

  // Helpers
  const normalize = (v) => (v === undefined || v === null ? '' : String(v));

  useEffect(() => {
    if (!originalData) return;

    const nameDiff = normalize(name) !== normalize(originalData.first_name);
    const emailDiff = normalize(email) !== normalize(originalData.email);
    const phoneDiff = normalize(phone) !== normalize(originalData.phone_number);

    setNameChanged(nameDiff);
    setEmailChanged(emailDiff);
    setPhoneChanged(phoneDiff);
    if (phoneDiff) {
      setPhoneVerified(false);
    } else {
      setPhoneVerified(true);
    }
  }, [name, email, phone, originalData]);

  useEffect(() => {
    const anyNonPhoneChange = nameChanged || emailChanged || imageChanged;
    if (phoneChanged && !phoneVerified) {
      setIsSaveEnabled(false);
      return;
    }
    const canSave = anyNonPhoneChange || phoneChanged;
    setIsSaveEnabled(Boolean(canSave));
  }, [nameChanged, emailChanged, imageChanged, phoneChanged, phoneVerified]);

  const handleSave = async () => {
    try {
      let studentId = await AsyncStorage.getItem('studentId')
      let classId = await AsyncStorage.getItem('classId')
      await dispatch(
        updateProfile({
          student_id: studentId,
          class_id: classId,
          email,
          first_name: name,
          phone_number: phone,
          profile_image: profileImage,
        })
      ).unwrap();


   //   Alert.alert('Success', 'Profile updated successfully');
       Toast.show({
              type: "success",
              text1: "Profile updated successfully",
              text2:"Profile updated successfully!",
              visibilityTime: 3000, 
   
            });
      // refresh profile and reset flags
      await dispatch(getProfile({ student_id: studentId, class_id: classId }));
    } catch (err) {
      console.log('Update failed:', err);
      Alert.alert('Error', 'Failed to update profile. Try again.');
          Toast.show({
              type: "Error",
              text1: "Failed to update profile. Try again.",
              text2:"Failed to update profile. Try again!",
              visibilityTime: 3000, 
   
            });
    }
  };

  const handleVerifyPhone = async () => {
    setVerifying(true);
    setShowOtpModal(true)
    try {
      let studentId = await AsyncStorage.getItem('studentId')
      let classId = await AsyncStorage.getItem('classId')
      await dispatch(
        SendOtpUpdatePhoneNumber({
          student_id: studentId,
          class_id: classId,
          new_phone_number: phone
        })
      ).unwrap();
      Alert.alert('Success', 'Otp sent');
      setShowOtpModal(true)
    } catch (err) {
      console.log('Update failed:', err);
      Alert.alert('Error', 'Failed to update profile. Try again.');
    }

  };

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
              uri:
                profileImage && profileImage.startsWith('file')
                  ? profileImage // picked from camera/gallery
                  : profileImage
                    ? baseURL + profileImage // from backend
                    : 'https://media.istockphoto.com/id/2151669184/vector/vector-flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral.jpg?s=612x612&w=0&k=20&c=UEa7oHoOL30ynvmJzSCIPrwwopJdfqzBs0q69ezQoM8='
            }}
            style={styles.profileImage}
            resizeMode="cover"
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
            placeholderTextColor={colors.greyInput}
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
            placeholderTextColor={colors.greyInput}
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
              placeholderTextColor={colors.greyInput}
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={showOtpModal}
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <Text style={styles.title}>Verify Signup OTP</Text>
              <TouchableOpacity onPress={() => setShowOtpModal(false)}>
                <Entypo size={SF(30)} color={''} name={'cross'} />
              </TouchableOpacity>
            </View>
            <OTPInput
              length={6}
              onSubmit={async (otp) => {
                console.log(phone, "phone", otp, "opt")
                try {
                  const result = await dispatch(
                    VerifyUpdatePhoneNumber({ new_phone_number: phone, otp: otp })
                  );
                  if (verifyOtp1.fulfilled.match(result)) {
                    console.log("Success:", result.payload);
                    Alert.alert(
                      "Success",
                      result.payload.message || "OTP Verified",
                      [
                        {
                          text: "OK",
                          onPress: () =>
                            navigation.navigate("CreatePassword", { phone }),
                        },
                      ]
                    );
                  } else {
                    console.log("Error:", result.payload);
                    Alert.alert(
                      "Error",
                      result.payload?.message || "OTP verification failed"
                    );
                  }
                } finally {

                }
              }}
              onResend={() => {
                dispatch(
                  reSendOtp({
                    phone_number: phone,
                  }),
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </ContainerComponent>
  );
};

export default EditProfile;

const themedStyles = (colors) => StyleSheet.create({
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
    color:colors.text,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.text,
    padding: SH(10),
    borderRadius: 8,
    fontSize: SF(15),
    color:colors.text
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
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor:colors.grey,
    padding: 20,
    borderRadius: 12,
  },
});
