import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import { loginImg, userProfile } from '../../images';
import { SF, SH, SW } from '../../utils/dimensions';
import ContainerComponent from '../../components/commonComponents/Container';
import Video from 'react-native-video';
import Fonts from '../../utils/Fonts';
import { darkColors, lightColors } from '../../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { getDemoData } from '../../redux/reducer/demopagereduce';
import LinearGradient from 'react-native-linear-gradient';

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
  const [fullScreenVideo, setFullScreenVideo] = useState(null);

  const GotoLogin = () => {
    navigation.navigate('LoginScreen');
  };
  const GotoSignUp = () => {
    navigation.navigate('SignUpScreen');
  };

  useEffect(() => {
    dispatch(getDemoData());
  }, [dispatch]);

  const ClassCard = ({ item }) => {
    const [expanded, setExpanded] = useState(false);
    const [paused, setPaused] = useState(true);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef(null);

    const onProgress = (data) => {
      setProgress(data.currentTime / data.seekableDuration);
    };

    const togglePlayPause = () => {
      setPaused(!paused);
    };

    const openFullScreen = () => {
      setFullScreenVideo(item);
    };
//console.log(item,'====item====')
    return (
      <View style={styles.card}>
        <View style={styles.videoContainer}>
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={openFullScreen}
          >
            <Video
              ref={videoRef}
              source={{ uri: item.vedio_url }}
              style={styles.video}
              resizeMode="cover"
              volume={1.0}
              paused={paused}
              onProgress={onProgress}
            />
            <View style={styles.videoOverlay}>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={togglePlayPause}
              >
                <Ionicons 
                  name={paused ? 'play-circle' : 'pause-circle'} 
                  size={48} 
                  color="rgba(255,255,255,0.8)" 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.fullscreenButton}
                onPress={openFullScreen}
              >
                <Ionicons 
                  name="expand" 
                  size={24} 
                  color="white" 
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progress * 100}%` }
              ]} 
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: SH(10),
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
          <LinearGradient
            colors={['rgba(254,238,245,1)', 'rgba(223,238,255,1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.subscribeText}>Subscribe Now</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.primary} style={{ marginLeft: 5 }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const FullScreenVideo = () => {
    const [paused, setPaused] = useState(false);
    const videoRef = useRef(null);

    const togglePlayPause = () => {
      setPaused(!paused);
    };

    return (
      <Modal
        visible={fullScreenVideo !== null}
        supportedOrientations={['portrait', 'landscape']}
        animationType="fade"
      >
        <View style={styles.fullScreenContainer}>
          <Video
            ref={videoRef}
            source={{ uri: fullScreenVideo?.vedio_url }}
            style={styles.fullScreenVideo}
            resizeMode="contain"
            volume={1.0}
            paused={paused}
            controls={false}
          />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setFullScreenVideo(null)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.fullScreenPlayButton}
            onPress={togglePlayPause}
          >
            <Ionicons 
              name={paused ? 'play-circle' : 'pause-circle'} 
              size={64} 
              color="rgba(255,255,255,0.8)" 
            />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  };

  return (
   <ContainerComponent>
        <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={loginImg}
              resizeMode="cover"
              style={styles.logo}
            />
            <Text style={styles.logoText}>Student Book</Text>
          </View>
          <View style={styles.authButtons}>
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={GotoSignUp}
            >
              <Text style={styles.signUpText}>SignUp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={GotoLogin}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.hero}>
            <Image
              source={{
                uri: 'https://img.freepik.com/free-vector/online-learning-concept_23-2148504542.jpg',
              }}
              style={styles.heroImg}
            />
            <View style={styles.heroContent}>
              <Text style={styles.heroTitle}>Welcome to Student Book</Text>
              <Text style={styles.heroSubtitle}>
                Learn smarter, grow faster. Start your journey today.
              </Text>
              <TouchableOpacity
                style={styles.getStartedButton}
                onPress={GotoSignUp}
              >
                <LinearGradient
                  colors={['rgba(254,238,245,1)', 'rgba(223,238,255,1)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.getStartedText}>Get Started</Text>
                  <Ionicons name="arrow-forward" size={20} color={colors.primary} style={{ marginLeft: 5 }} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Classes Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Demo Videos</Text>
            <FlatList
              data={ClassData}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ paddingBottom: SH(10) }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <ClassCard item={item} />}
            />
          </View>
          
          {/* Why Choose Us Section */}
          <View style={styles.featureSection}>
            <Text style={styles.sectionTitle}>Why Choose Us?</Text>
            <View style={styles.featureList}>
              {features.map(f => (
                <View key={f.id} style={styles.featureCard}>
                  <View style={styles.featureIconContainer}>
                    <Ionicons name={f.icon} size={28} color="#007bff" />
                  </View>
                  <Text style={styles.featureTitle}>{f.title}</Text>
                  <Text style={styles.featureDesc}>{f.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Call to Action */}
          <View style={styles.ctaSection}>
            <LinearGradient
              colors={['rgba(254,238,245,0.8)', 'rgba(223,238,255,0.8)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              <Text style={styles.ctaTitle}>Ready to start learning?</Text>
              <Text style={styles.ctaSubtitle}>Join thousands of students achieving their goals</Text>
              <TouchableOpacity
                style={styles.ctaButton}
                onPress={GotoSignUp}
              >
                <Text style={styles.ctaButtonText}>Sign Up Now</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </ScrollView>
      </View>
      {fullScreenVideo && <FullScreenVideo />}
   </ContainerComponent>
  
  );
};

export default LandingPage;

const themedStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
    },
    scrollContainer: {
      paddingBottom: SH(10),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: SH(15),
      alignItems: 'center',
      paddingHorizontal: SW(20),
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.2)',
    },
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      height: 40,
      width: 40,
      borderRadius: 40,
    },
    logoText: {
      fontSize: 18,
      marginLeft: 10,
      fontWeight: 'bold',
      color: colors.text,
    },
    authButtons: {
      flexDirection: 'row',
    },
    signUpButton: {
      backgroundColor: 'transparent',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primary,
      marginRight: 10,
    },
    signUpText: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 14,
      color: colors.primary,
    },
    loginButton: {
      backgroundColor: colors.primary,
      borderRadius: 20,
    },
    loginText: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      fontSize: 14,
      color: 'white',
    },
    hero: {
      alignItems: 'center', 
      padding: 20,
    },
    heroImg: { 
      width: '100%', 
      height: 200, 
      borderRadius: 12, 
      marginBottom: 16,
    },
    heroContent: {
      alignItems: 'center',
    },
    heroTitle: { 
      fontSize: 24, 
      fontWeight: '700', 
      color: colors.text, 
      textAlign: 'center',
      marginBottom: 8,
    },
    heroSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    getStartedButton: {
      width: '60%',
    },
    gradientButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 12,
      borderRadius: 25,
     
    },
    getStartedText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
     
    },
    section: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      paddingLeft: 8,
    },
    // Class Card
    card: {
     backgroundColor: colors.background,
      padding: 16,
      marginBottom: 20,
      borderRadius: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    videoContainer: {
      position: 'relative',
      borderRadius: 12,
      overflow: 'hidden',
    },
    video: {
      width: '100%',
      height: 200,
      backgroundColor: '#000',
    },
    videoOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.2)',
    },
    playButton: {
      padding: 10,
    },
    fullscreenButton: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 15,
      padding: 5,
    },
    progressContainer: {
      marginTop: 8,
    },
    progressBar: {
      height: 4,
      backgroundColor: '#ddd',
      borderRadius: 2,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary,
    },
    title: { 
      fontSize: 18, 
      fontWeight: '700', 
      color: colors.text,
    },
    cost: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    description: { 
      fontSize: 14, 
      color: colors.textSecondary, 
      marginTop: 8,
      lineHeight: 20,
    },
    seeMore: { 
      marginTop: 8, 
      color: colors.primary, 
      fontWeight: '600',
      fontSize: 14,
    },
    subscribeBtn: {
      marginTop: 16,
      borderRadius: 25,
      overflow: 'hidden',
    },
    subscribeText: {
      color: colors.primary,
      fontWeight: '600',
      fontSize: 16,
    },
    // Features
    featureSection: { 
      padding: 20,
    //  backgroundColor:colors.background
    },
    featureList: { 
      flexDirection: 'row', 
      justifyContent: 'space-between',
      flexWrap: 'wrap',
    },
    featureCard: {
      width: '30%',
      alignItems: 'center',
      padding: 12,
      backgroundColor: colors.background,
      borderRadius: 12,
      marginBottom: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2.22,
      elevation: 3,
    },
    featureIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(0,123,255,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    featureTitle: { 
      fontSize: 14, 
      fontWeight: '600', 
      color: colors.text,
      textAlign: 'center',
      marginBottom: 4,
    },
    featureDesc: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    // CTA Section
    ctaSection: {
      padding: 20,
    },
    ctaGradient: {
      padding: 24,
      borderRadius: 16,
      alignItems: 'center',
    },
    ctaTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    ctaSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 20,
    },
    ctaButton: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 25,
    },
    ctaButtonText: {
      color: 'white',
      fontWeight: '600',
      fontSize: 16,
    },
    // Full Screen Video
    fullScreenContainer: {
      flex: 1,
      backgroundColor: 'black',
      justifyContent: 'center',
    },
    fullScreenVideo: {
      width: '100%',
      height: '100%',
    },
    closeButton: {
      position: 'absolute',
      top: 40,
      right: 20,
      zIndex: 10,
    },
    fullScreenPlayButton: {
      position: 'absolute',
      alignSelf: 'center',
      zIndex: 10,
    },
  });