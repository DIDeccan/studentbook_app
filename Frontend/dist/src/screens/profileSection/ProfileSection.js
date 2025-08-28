import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal
} from 'react-native';
import ContainerComponent from '../../components/commonComponents/Container';
import { SF, SH, SW } from '../../utils/dimensions';
import { AboutUs, ContackUsIcon, deleteIcon, LogoutIcon, PasswordlockIcon, PrivacyPolicy, ProfileIcon, TermsCondtions } from '../../images';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { darkColors, lightColors } from '../../utils/Colors';

const ProfileSection = ({ navigation }) => {
    const dispatch = useDispatch();
     const themeMode = useSelector((state) => state.theme.theme);
    let colors = (themeMode === 'dark') ? darkColors : lightColors;
    const styles = themedStyles(colors);
  const [logout, setLogOut] = useState(false);

  const EditProfileBtn = () => {
    navigation.navigate('EditProfile');
  };

  const handleConfirmLogout = () => {
    setLogOut(false);
    // Add your actual logout logic here
    console.log("User logged out");
  };

const settingScreenBtn = ()=>{
navigation.navigate('SettingScreen')
} 

 return (
  <>
    <ContainerComponent>
      {/* <TouchableOpacity onPress={settingScreenBtn}>
           <Text style={{textAlign:'right'}}>Settings</Text>
      </TouchableOpacity> */}
    
      {/* Profile Header */}
      <View style={styles.profileHeader}>
       
        <Image
          source={{
            uri: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
          }}
          style={styles.profileImage}
        />
        <Text style={[styles.name]}>Vasavi Pillala</Text>
        <Text style={styles.title}>React Native Developer | Vizianagaram</Text>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: 'center',
            paddingHorizontal: SW(10),
            paddingBottom: SH(13),
            alignContent: 'center'
          }}
        >
          {/* Edit Profile */}
          <TouchableOpacity onPress={EditProfileBtn} style={[styles.touchableCard, { borderTopLeftRadius: SH(10), borderTopRightRadius: SH(10) }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={ProfileIcon} resizeMode="cover" style={styles.iconsStyle} />
              <Text style={{ fontSize: SF(16), marginHorizontal: SW(10) }}>
                Edit Profile
              </Text>
            </View>
            <MaterialIcons size={SF(35)} name={'keyboard-arrow-right'} />
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity style={styles.touchableCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={PasswordlockIcon} resizeMode="cover" style={styles.iconsStyle} />
              <Text style={{ fontSize: SF(16), marginHorizontal: SW(10) }}>
                Change Password
              </Text>
            </View>
            <MaterialIcons size={SF(35)} name={'keyboard-arrow-right'} />
          </TouchableOpacity>

          {/* Terms & Conditions */}
          <TouchableOpacity style={styles.touchableCard} onPress={() => navigation.navigate('TermsAndConditions')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={TermsCondtions} resizeMode="cover" style={styles.iconsStyle} />
              <Text style={{ fontSize: SF(16), marginHorizontal: SW(10) }}>
                Terms & Conditions
              </Text>
            </View>
            <MaterialIcons size={SF(35)} name={'keyboard-arrow-right'} />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity style={styles.touchableCard} onPress={() => navigation.navigate('PrivacyPolicyScreen')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={PrivacyPolicy} resizeMode="cover" style={styles.iconsStyle} />
              <Text style={{ fontSize: SF(16), marginHorizontal: SW(10) }}>
                Privacy Policy
              </Text>
            </View>
            <MaterialIcons size={SF(35)} name={'keyboard-arrow-right'} />
          </TouchableOpacity>

          {/* About Us */}
          <TouchableOpacity style={styles.touchableCard} onPress={() => navigation.navigate('AboutUs')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={AboutUs} resizeMode="cover" style={styles.iconsStyle} />
              <Text style={{ fontSize: SF(16), marginHorizontal: SW(10) }}>
                About Us
              </Text>
            </View>
            <MaterialIcons size={SF(35)} name={'keyboard-arrow-right'} />
          </TouchableOpacity>

          {/* Contact Us */}
          <TouchableOpacity onPress={() => navigation.navigate('ContactUs')} style={styles.touchableCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={ContackUsIcon} resizeMode="cover" style={styles.iconsStyle} />
              <Text style={{ fontSize: SF(16), marginHorizontal: SW(10) }}>
                Contact Us
              </Text>
            </View>
            <MaterialIcons size={SF(35)} name={'keyboard-arrow-right'} />
          </TouchableOpacity>

          {/* Notifications */}
          <TouchableOpacity style={styles.touchableCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: 'https://cdn-icons-png.freepik.com/512/4556/4556844.png' }}
                resizeMode="cover"
                style={styles.iconsStyle}
              />
              <Text style={styles.sideHeading}>
                Notifications
              </Text>
            </View>
            <MaterialIcons size={SF(35)} name={'keyboard-arrow-right'} />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={[styles.touchableCard, { borderBottomLeftRadius: SH(10), borderBottomRightRadius: SH(10) }]}
            onPress={() => {
              console.log("hii log out")
              setLogOut(true)}}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={LogoutIcon} resizeMode="cover" style={styles.iconsStyle} />
              <Text style={{ fontSize: SF(16), marginHorizontal: SW(10), color: "black" }}>
                Log Out
              </Text>
            </View>
            <MaterialIcons size={SF(35)} name={'keyboard-arrow-right'} />
          </TouchableOpacity>
        </View>
      </ScrollView>  
    </ContainerComponent>
        {/* Logout Confirmation Modal */}
      <Modal
        visible={logout}
        transparent
        animationType="fade"
        onRequestClose={() => setLogOut(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setLogOut(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLogout}>
                <Text style={styles.confirmText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const themedStyles =(colors)=> StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 0.8,
    borderBottomColor: '#ddd',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: SF(18),
    fontWeight: 'bold',
    color:colors.text
  },
  title: {
    color: '#666',
    fontSize: SF(13),
    marginTop: 4,
    color:colors.text
  },
  touchableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SW(10),
    paddingVertical: SH(12),
    backgroundColor: colors.grey,
    elevation: 4,
    marginTop: SH(5),
  },
  iconsStyle: {
    height: SH(35),
    width: SW(35),
    borderRadius: 50
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  modalMessage: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  cancelButton: {
    flex: 1,
    marginRight: 5,
    paddingVertical: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center'
  },
  confirmButton: {
    flex: 1,
    marginLeft: 5,
    paddingVertical: 10,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center'
  },
  cancelText: {
    color: '#000',
    fontWeight: 'bold'
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  sideHeading:{
    fontSize: SF(16),
     marginHorizontal: SW(10),
    // color:colors.background
  }
});

export default ProfileSection;
