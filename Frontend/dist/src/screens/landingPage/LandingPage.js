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
import React, { useEffect, useState } from 'react';
import { loginImg, userProfile } from '../../images';
import { SF, SH, SW } from '../../utils/dimensions';
import ContainerComponent from '../../components/commonComponents/Container';
import Video from 'react-native-video';
import Fonts from '../../utils/Fonts';
import { darkColors, lightColors } from '../../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { getDemoData } from '../../redux/reducer/demopagereduce';

const ClassData = [
  {
    id: 1,
    name: 'Class 6',
    cost: 2000,
    discription:
      'This class introduces students to the basics of all core subjects. It focuses on strengthening fundamental concepts in mathematics, science, and language, while also encouraging creativity and participation in extracurricular activities.',
    vedio_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 2,
    name: 'Class 7',
    cost: 2000,
    discription:
      'This class introduces students to the basics of all core subjects. It focuses on strengthening fundamental concepts in mathematics, science, and language, while also encouraging creativity and participation in extracurricular activities.',
    vedio_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 3,
    name: 'Class 8',
    cost: 2000,
    discription:
      'This class introduces students to the basics of all core subjects. It focuses on strengthening fundamental concepts in mathematics, science, and language, while also encouraging creativity and participation in extracurricular activities.',
    vedio_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 4,
    name: 'Class 9',
    cost: 2000,
    discription:
      'This class introduces students to the basics of all core subjects. It focuses on strengthening fundamental concepts in mathematics, science, and language, while also encouraging creativity and participation in extracurricular activities.',
    vedio_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
  {
    id: 5,
    name: 'Class 10',
    cost: 2000,
    discription:
      'This class introduces students to the basics of all core subjects. It focuses on strengthening fundamental concepts in mathematics, science, and language, while also encouraging creativity and participation in extracurricular activities.',
    vedio_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
  },
];
const features = [
  {
    id: 1,
    icon: 'book-outline',
    title: 'Expert Content',
    desc: 'High-quality study material designed by experts.',
  },
  {
    id: 2,
    icon: 'school-outline',
    title: 'Interactive Learning',
    desc: 'Engaging videos and activities.',
  },
  {
    id: 3,
    icon: 'time-outline',
    title: 'Anytime Access',
    desc: 'Learn at your own pace, anytime & anywhere.',
  },
];
const LandingPage = ({ navigation }) => {
  const themeMode = useSelector(state => state.theme.theme);
  let colors = themeMode === 'dark' ? darkColors : lightColors;
  const styles = themedStyles(colors);
  const dispatch = useDispatch();
  const DemoData = useSelector(state => state.demoData.getDemoVideosData);
  // console.log(DemoData,"==========demo")
  // const [expanded, setExpanded] = useState(false);

  const GotoLogin = () => {
    navigation.navigate('LoginScreen');
  };
  const GotoSignUp = () => {
    navigation.navigate('SignUpScreen');
  };

  useEffect(() => {
    dispatch(getDemoData());
  }, [dispatch]);

  //   useEffect(()=>{
  //  console.log(DemoData,"=0=p[p[")
  // },[DemoData])

  const ClassCard = ({ item }) => {
    const [expanded, setExpanded] = useState(false);

    return (
      <View style={styles.card}>
        <Video
          source={{ uri: item.vedio_url }}
          style={styles.video}
          resizeMode="cover"
          volume={1.0}
          controls={true}
          paused={true}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={styles.title}>{item.name}</Text>
          <Text style={styles.cost}>₹ {item.cost}</Text>
        </View>
        <Text style={styles.description}>
          {expanded ? item.discription : item.discription.slice(0, 100) + '...'}
        </Text>
        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text style={styles.seeMore}>
            {expanded ? 'See less' : 'See more'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.subscribeBtn}
          onPress={GotoSignUp}
        >
          <Text style={styles.subscribeText}>Subscribe</Text>
        </TouchableOpacity>
      </View>
    );
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
            {/* <View
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
            </View> */}
            {/* <View>
            <Text  style={{
                    fontSize: SF(25),
                    marginTop: SH(20),
                    fontFamily: Fonts.Bold,
                    color:'blue',
                    textAlign:'center'
                  }}>Demo Videos</Text>  
            </View>  */}

            {/* Hero Section */}
            <View style={styles.hero}>
              <Image
                source={{
                  uri: 'https://img.freepik.com/free-vector/online-learning-concept_23-2148504542.jpg',
                }}
                style={styles.heroImg}
              />
              <Text style={styles.heroTitle}>Welcome to Student Book</Text>
              <Text style={styles.heroSubtitle}>
                Learn smarter, grow faster. Start your journey today.
              </Text>
            </View>
            <FlatList
              data={ClassData}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ paddingBottom: SH(10) }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <ClassCard item={item} />}
              // renderItem={({ item }) => (
              //   <View style={styles.videoContainer}>
              //     <Video
              //       source={{ uri: item.videoUrl }}
              //       style={styles.backgroundVideo}
              //       volume={1.0}
              //       controls={true}
              //       paused={true}
              //       resizeMode="cover"
              //     />
              //     <View styel={{paddingHorizontal:SW(10)}}>
              //        <Text style={styles.nameStyle}>
              //       {item.className}
              //     </Text>
              //     <TouchableOpacity style={styles.subscribeBtn}>
              //       <Text style={styles.subscribeText}>Subscribe</Text>
              //     </TouchableOpacity>
              //     </View>
              //   </View>
              // )}
            />
            {/* Why Choose Us Section */}
            <View style={styles.featureSection}>
              <Text style={styles.sectionTitle}>Why Choose Us?</Text>
              <View style={styles.featureList}>
                {features.map(f => (
                  <View key={f.id} style={styles.featureCard}>
                    <Ionicons name={f.icon} size={28} color="#007bff" />
                    <Text style={styles.featureTitle}>{f.title}</Text>
                    <Text style={styles.featureDesc}>{f.desc}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </ContainerComponent>
  );
};

export default LandingPage;

const themedStyles = colors =>
  StyleSheet.create({
    backgroundVideo: {
      height: SH(220),
      width: '100%',
      backgroundColor: '#000',
      //  borderTopLeftRadius: SH(10),
      // borderTopRightRadius: SH(10),
      overflow: 'hidden',
    },
    LoginText: {
      padding: 8,
      fontSize: 17,
      color: 'white',
    },
    subscribeText: {
      color: 'white',
      padding: SH(10),
      textAlign: 'center',
      fontSize: SF(16),
    },
    subscribeBtn: {
      backgroundColor: colors.primary,
      width: SW(200),
      borderRadius: SH(10),
      marginTop: SH(4),
    },
    nameStyle: {
      fontSize: SF(16),
      marginTop: SH(5),
      textAlign: 'center',
    },
    videoContainer: {
      marginTop: SH(25),
      height: SH(300),
      backgroundColor: 'white',
      // borderRadius:SH(10),
      alignItems: 'center',
    },
    hero: { alignItems: 'center', padding: 16 },
    heroImg: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12 },
    heroTitle: { fontSize: 22, fontWeight: '700', color: '#222' },
    heroSubtitle: {
      fontSize: 14,
      color: '#555',
      textAlign: 'center',
      marginTop: 4,
    },

    // Features
    featureSection: { padding: 16 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: '#222',
      marginBottom: 12,
    },
    featureList: { flexDirection: 'row', justifyContent: 'space-between' },
    featureCard: {
      flex: 1,
      alignItems: 'center',
      padding: 8,
      marginHorizontal: 4,
    },
    featureTitle: { fontSize: 14, fontWeight: '600', marginTop: 4 },
    featureDesc: {
      fontSize: 12,
      color: '#555',
      textAlign: 'center',
      marginTop: 2,
    },

    // Class Card
    card: {
      backgroundColor: '#fff',
      padding: 16,
      marginBottom: 16,
      marginHorizontal: 12,
      borderRadius: 12,
      elevation: 3,
    },
    title: { fontSize: 18, fontWeight: '700', color: '#222' },
    cost: {
      fontSize: 14,
      fontWeight: '600',
      color: '#007bff',
      marginBottom: 8,
    },
    description: { fontSize: 14, color: '#555' },
    seeMore: { marginTop: 4, color: '#007bff', fontWeight: '600' },
    video: {
      marginTop: 12,
      width: '100%',
      height: 200,
      borderRadius: 10,
      backgroundColor: '#000',
    },

    // Subscribe Button
    subscribeBtn: {
      marginTop: 12,
      backgroundColor: '#007bff',
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: 'center',
    },
    subscribeText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  });
