import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import ContainerComponent from '../../components/commonComponents/Container';
import { ImageBackground } from 'react-native';
import { childrenImg, loginImg, Spalsh_Logo1, userProfile } from '../../images';
import { SF, SH, SW } from '../../utils/dimensions';
import { ScrollView } from 'react-native';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/reducer/themeReducer';
import { darkColors, lightColors } from '../../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AmazonAdsCarousel from '../../components/commonComponents/AmazonAdsCard';
import LinearGradient from 'react-native-linear-gradient';
import HalfWatchedVideos from '../../components/commonComponents/HalfWatchedVideos';
import { MainContentHome } from '../../redux/reducer/demopagereduce';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector(state => state.theme.theme);
  const colors = themeMode === 'dark' ? darkColors : lightColors;
  const Contentdata = useSelector((state) => state.demoData.mainContentData)
  const { loading } = useSelector((state) => state.demoData)
  //  console.log(Contentdata,"==============content====")
  const isFocused = useIsFocused();


  useEffect(() => {
    const fetchDashboard = async () => {
      let storedId = await AsyncStorage.getItem('studentId');
      let classid = await AsyncStorage.getItem('classId');
      const studentId = storedId ? JSON.parse(storedId) : null;
      const classId = classid ? JSON.parse(classid) : null;

      if (studentId && classId) {
        try {
          let result = await dispatch(MainContentHome({ student_id: studentId, class_id: classId })).unwrap();
        } catch (err) {
          console.warn('MainContentHome API Error:', err);
        }
      } else {
        console.warn("Missing studentId or classId in AsyncStorage");
        setLoading(false);
      }
    };
    if (isFocused) fetchDashboard();
  }, [isFocused, dispatch]);

  const contentSelection = (item) => {
    if (item.name === "My Subjects") {
      navigation.navigate("ContentSection", { item });
    } else if (item.name === "Yoga Tips") {
      navigation.navigate("YogaVideos", { item });
    } else {
      navigation.navigate("HealthTips", { item });
    }
  };

  const getIconName = (item) => {
    if (item.name === "My Subjects") {
      return "menu-book";
    } else if (item.name === "Yoga Tips") {
      return "self-improvement";
    } else if (item.name === "Sports") {
      return "sports-basketball";
    } else if (item.name === "Healthy Living") {
      return "favorite";
    } else if (item.name === "Current Affairs") {
      return "article";
    } else {
      return "book"; // default fallback icon
    }
  };

  const PlaceHolderImage = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
  const renderContentItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.contentCard, { backgroundColor: colors.cardBackground }]}
        onPress={() => contentSelection(item)}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image || PlaceHolderImage }}
            style={styles.contentImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          />
          <View style={styles.iconContainer}>
            <MaterialIcons name={getIconName(item)} size={20} color="white" />
          </View>
        </View>
        <Text style={[styles.contentTitle, { color: colors.text }]} numberOfLines={1}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ContainerComponent>
      <View style={[styles.container, {}]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={Spalsh_Logo1}
              resizeMode="cover"
              style={styles.logo}
            />
            <Text style={[styles.appName, { color: colors.text }]}>
              Student Book
            </Text>
          </View>
          <View style={styles.headerRight}>
            {/* <TouchableOpacity style={styles.iconButton}>
              <Fontisto name="bell" size={22} color={colors.text} />
              <View style={[styles.notificationBadge, { backgroundColor: colors.primary }]} />
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => dispatch(toggleTheme())}
            >
              {themeMode === 'light' ? (
                <Ionicons name="moon-outline" size={22} color={colors.text} />
              ) : (
                <Ionicons name="sunny-outline" size={22} color={colors.text} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {/* Hero Banner */}
          <View style={styles.heroContainer}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D',
              }}
              resizeMode="cover"
              style={styles.heroImage}
              imageStyle={styles.heroImageStyle}
            >
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.7)']}
                style={styles.heroGradient}
              >
                <View style={styles.heroContent}>
                  <Text style={styles.heroText}>
                    Good Education With Motive Life
                  </Text>
                  <TouchableOpacity style={[styles.heroButton, { backgroundColor: colors.primary }]}>
                    <Text style={styles.heroButtonText}>Explore Now</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </ImageBackground>
          </View>

          {/* Ads Carousel */}
          <View style={styles.carouselContainer}>
            <AmazonAdsCarousel />
          </View>

          {/* Content Sections */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                My Content
              </Text>
              <TouchableOpacity>
                <Ionicons name="arrow-forward" size={SF(16)} color="#4361EE" />
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={Contentdata}
              renderItem={renderContentItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.contentList}
              ListEmptyComponent={
                loading ? (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: SH(50) }}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                ) : (
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: SH(50) }}>
                    <Text style={{ color: colors.text }}>No Content Available</Text>
                  </View>
                )
              }
            />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Continue Watching
              </Text>
              <TouchableOpacity>
                <Ionicons name="arrow-forward" size={SF(16)} color="#4361EE" />
              </TouchableOpacity>
            </View>
            <HalfWatchedVideos />
            {/* <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={ContentData.slice(0, 4)}
              renderItem={renderContentItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.contentList}
            /> */}

          </View>


          {/* Featured Section */}
          {/* <View style={[styles.featuredContainer, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.featuredHeader}>
              <MaterialIcons name="featured-play-list" size={24} color={colors.primary} />
              <Text style={[styles.featuredTitle, { color: colors.text }]}>
                Featured Content
              </Text>
            </View>
            <View style={styles.featuredContent}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGVhcm5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60' }}
                style={styles.featuredImage}
              />
              <View style={styles.featuredTextContainer}>
                <Text style={[styles.featuredContentTitle, { color: colors.text }]}>
                  Advanced Mathematics
                </Text>
                <Text style={[styles.featuredContentDesc, { color: colors.textSecondary }]} numberOfLines={2}>
                  Master complex concepts with our comprehensive guide to advanced mathematics.
                </Text>
                <TouchableOpacity style={[styles.featuredButton, { backgroundColor: colors.primary }]}>
                  <Text style={styles.featuredButtonText}>Start Learning</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View> */}
        </ScrollView>
      </View>
    </ContainerComponent>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SW(20),
    paddingVertical: SH(15),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    height: SH(40),
    width: SW(40),
    borderRadius: SH(20),
  },
  appName: {
    fontSize: SF(18),
    fontWeight: 'bold',
    marginLeft: SW(10),
  },
  iconButton: {
    padding: SW(8),
    marginLeft: SW(10),
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: SW(6),
    right: SW(6),
    width: SW(8),
    height: SW(8),
    borderRadius: SW(4),
  },
  heroContainer: {
    marginHorizontal: SW(15),
    marginVertical: SH(15),
    borderRadius: SH(15),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  heroImage: {
    height: SH(200),
    width: '100%',
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    borderRadius: SH(15),
  },
  heroGradient: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    padding: SW(20),
  },
  heroContent: {
    alignItems: 'center',
  },
  heroText: {
    fontSize: SF(18),
    fontWeight: 'bold',
    color: 'white',
    marginBottom: SH(15),
    textAlign: 'center',
  },
  heroButton: {
    paddingHorizontal: SW(20),
    paddingVertical: SH(10),
    borderRadius: SH(25),
  },
  heroButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  carouselContainer: {
    marginHorizontal: SW(15),
    marginBottom: SH(20),
  },
  sectionContainer: {
    marginBottom: SH(25),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SW(20),
    marginBottom: SH(15),
  },
  sectionTitle: {
    fontSize: SF(18),
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: SF(14),
    fontWeight: '500',
  },
  contentList: {
    paddingHorizontal: SW(15),
  },
  contentCard: {
    width: SW(180),
    marginRight: SW(15),
    borderRadius: SH(12),
    overflow: 'hidden',
    // elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,

  },
  imageContainer: {
    position: 'relative',
    height: SH(120),
  },
  contentImage: {
    height: '100%',
    width: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  iconContainer: {
    position: 'absolute',
    bottom: SW(8),
    left: SW(8),
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: SW(12),
    padding: SW(4),
  },
  contentTitle: {
    fontSize: SF(13),
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: SH(10),
    paddingHorizontal: SW(5),
  },
  featuredContainer: {
    marginHorizontal: SW(15),
    marginBottom: SH(25),
    borderRadius: SH(15),
    padding: SW(15),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SH(15),
  },
  featuredTitle: {
    fontSize: SF(18),
    fontWeight: 'bold',
    marginLeft: SW(8),
  },
  featuredContent: {
    flexDirection: 'row',
  },
  featuredImage: {
    width: SW(100),
    height: SH(120),
    borderRadius: SH(10),
  },
  featuredTextContainer: {
    flex: 1,
    marginLeft: SW(15),
    justifyContent: 'space-between',
  },
  featuredContentTitle: {
    fontSize: SF(16),
    fontWeight: 'bold',
    marginBottom: SH(5),
  },
  featuredContentDesc: {
    fontSize: SF(13),
    marginBottom: SH(10),
  },
  featuredButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: SW(15),
    paddingVertical: SH(8),
    borderRadius: SH(15),
  },
  featuredButtonText: {
    color: 'white',
    fontSize: SF(12),
    fontWeight: '600',
  },
});