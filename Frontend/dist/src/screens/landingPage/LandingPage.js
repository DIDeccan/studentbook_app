import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  ImageBackground,
} from 'react-native';
import React from 'react';
import { loginImg, userProfile } from '../../images';
import { SF, SH, SW } from '../../utils/dimensions';
import ContainerComponent from '../../components/commonComponents/Container';
import Video from 'react-native-video';
import Fonts from '../../utils/Fonts';
import { useSelector } from 'react-redux';
import { darkColors, lightColors } from '../../utils/Colors';
const ClassData = [
  {
    id: 1,
    className: '6th Class Demo Video',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 2,
    className: '7th Class Demo Video',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 3,
    className: '8th Class Demo Video',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 4,
    className: '9th Class Demo Video',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 5,
    className: '10th Class Demo Video',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
    {
    id: 6,
    className: '10th Class Demo Video',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
];
const LandingPage = ({ navigation }) => {
  const themeMode = useSelector((state) => state.theme.theme);
  let colors = (themeMode === 'dark') ? darkColors : lightColors;
  const styles = themedStyles(colors);
  const GotoLogin = () => {
    navigation.navigate('LoginScreen');
  };
  const GotoSignUp = () => {
    navigation.navigate('SignUpScreen');
  };
  return (
    <ContainerComponent>
      <View style={{ flex: 1 }}>
  
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: SH(15),
              alignItems: 'center',
              paddingHorizontal: SW(14),
                //paddingHorizontal: SW(14),
            }}
          >
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Image
                source={loginImg}
                resizeMode="cover"
                style={{ height: 40, width: 40, borderRadius: 40 }}
              />
              <Text style={{ fontSize: 17, marginLeft: 5 }}>Student Book</Text>
            </View>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: colors.primary,
                  borderRadius: 8,
                  marginHorizontal: 15,
                }}
              >
                <Text style={styles.LoginText} onPress={GotoSignUp}>
                  SignUp
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ backgroundColor: colors.primary, borderRadius: 8 }}
              >
                <Text style={styles.LoginText} onPress={GotoLogin}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>

      <ScrollView
          contentContainerStyle={{
          //  paddingHorizontal: SW(14),
            paddingBottom: SH(10),
          }}
        >
          <View>
            <View
              style={{
                height: 300,
                width: '100%',
                borderRadius: 10,
                backgroundColor: 'white',
              }}
            >
              <ImageBackground     source={{uri:'https://images.unsplash.com/photo-1541963463532-d68292c34b19?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D'}}
                style={{
                  height:'100%',
                  width: SW('100%'),
                  borderTopLeftRadius: SH(5),
                  borderTopRightRadius: SH(5),
                  justifyContent:'center'
                }}
                resizeMode="streatch">
                  <View style={{ padding: SW(15) }}>
                <Text style={{ fontSize: SF(20),color:'white' }}>
                  Welcome to Student Book.
                </Text>
                <Text
                  style={{
                    fontSize: SF(15),
                    marginTop: SH(3),
                    fontFamily: 'sans-serif',
                    color:'white'
                  }}
                >
                  ✅ Easy access to class notes.{'\n'}✅ Interactive lessons and
                  quizzes.{'\n'}✅ Track your progress easily.{'\n'}✅ All in
                  one student companion app.{'\n'}
                  ▶️ Learn anytime, anywhere{'\n'}
                
                </Text>
              </View>
              </ImageBackground>
            </View>
                    {/* <View>
            <Text  style={{
                    fontSize: SF(25),
                    marginTop: SH(20),
                    fontFamily: Fonts.Bold,
                    color:'blue',
                    textAlign:'center'
                  }}>Demo Videos</Text>  
            </View>  */}
            <FlatList
              data={ClassData}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ paddingBottom: SH(10) }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.videoContainer}>
                  <Video
                    source={{ uri: item.videoUrl }}
                    style={styles.backgroundVideo}
                    volume={1.0}
                    controls={true}
                    paused={true}
                    resizeMode="cover"
                  />
                  <View styel={{paddingHorizontal:SW(10)}}>
                     <Text style={styles.nameStyle}>
                    {item.className}
                  </Text>
                  <TouchableOpacity style={styles.subscribeBtn}>
                    <Text style={styles.subscribeText}>Subscribe</Text>
                  </TouchableOpacity>
                  </View>  
                </View>
              )}
            />
          </View>
        </ScrollView>
      </View>
    </ContainerComponent>
  );
};

export default LandingPage;

const themedStyles =(colors)=> StyleSheet.create({
  backgroundVideo: {
    height: SH(220),
    width: '100%',
    backgroundColor: '#000',
  //  borderTopLeftRadius: SH(10),
   // borderTopRightRadius: SH(10),
     overflow: 'hidden', 
  },
  LoginText:{
     padding: 8, 
     fontSize: 17,
     color:'white'
  },
  subscribeText:{
    color:'white',
    padding:SH(10),
    textAlign:'center',
    fontSize:SF(16)
  },
  subscribeBtn:{
    backgroundColor:colors.primary,
    width:SW(200),
    borderRadius:SH(10),
    marginTop:SH(4),
  },
  nameStyle:{
    fontSize: SF(16),
     marginTop: SH(5),
     textAlign:'center'
  },
  videoContainer:{
    marginTop: SH(25),
    height:SH(300),
    backgroundColor:'white',
   // borderRadius:SH(10),
    alignItems:'center'
  }
});
