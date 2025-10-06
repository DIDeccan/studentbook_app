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
import Colors, { darkColors, lightColors } from '../../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AmazonAdsCarousel from '../../components/commonComponents/AmazonAdsCard';
import LinearGradient from 'react-native-linear-gradient';
import HalfWatchedVideos from '../../components/commonComponents/HalfWatchedVideos';
import { MainContentHome } from '../../redux/reducer/demopagereduce';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { color } from 'react-native-elements/dist/helpers';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector(state => state.theme.theme);
  const colors = themeMode === 'dark' ? darkColors : lightColors;
  const Contentdata = useSelector((state) => state.demoData.mainContentData)
  const { loading } = useSelector((state) => state.demoData)
  const isFocused = useIsFocused();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      let storedId = await AsyncStorage.getItem('studentId');
      let classid = await AsyncStorage.getItem('classId');
      const studentId = storedId ? JSON.parse(storedId) : null;
      const classId = classid ? JSON.parse(classid) : null;

      if (studentId && classId) {
        try {
          let result = await dispatch(MainContentHome({ student_id: studentId, class_id: classId })).unwrap();
         // console.log(result,"res")
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
      return "book";
    }
  };

  const getTagColor = (tagColor) => {
    const colorMap = {
      'primary': '#4361EE',
      'success': '#4CAF50',
      'secondary': '#6C757D',
      'danger': '#DC3545',
      'warning': '#FFC107',
      'info': '#17A2B8'
    };
    return colorMap[tagColor] || '#4361EE';
  };

  const PlaceHolderImage = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
  
  const renderContentItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[styles.contentCard, { 
          backgroundColor: '#FFFFFF',
        }]}
        onPress={() => contentSelection(item)}
        activeOpacity={0.7}
      >
    
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image || PlaceHolderImage }}
            style={styles.contentImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.1)']}
            style={styles.imageGradient}
          />
        </View>
            <View style={styles.cardHeader}>
          <View style={[styles.tag, { backgroundColor: getTagColor(item.tagColor) }]}>
            <Text style={styles.tagText}>{item.sub_title}</Text>
          </View>
          <View style={[styles.iconContainer, { backgroundColor: getTagColor(item.tagColor) }]}>
            <MaterialIcons name={getIconName(item)} size={20} color="white" />
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={[styles.contentTitle, { color: colors.text }]} numberOfLines={1}>
            {item.name}
          </Text>
          {/* <Text style={[styles.contentDescription, { color: colors.textSecondary }]} numberOfLines={2}>
            {item.description}
          </Text> */}
             <Text style={styles.discription}>
                    {expanded ? item.description : item.description?.slice(0, 100) + '...'}
                  </Text>
                  <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                    <Text style={[styles.seeMore,{color:colors.primary}]}>
                      {expanded ? 'See less' : 'See more'}
                    </Text>
                  </TouchableOpacity>
        </View>
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
              <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  My Content
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  Explore your learning materials
                </Text>
              </View>
            </View>

            <FlatList
              scrollEnabled={false}
              data={Contentdata}
              renderItem={renderContentItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.contentList}
              ListEmptyComponent={
                loading ? (
                  <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text style={{ color: colors.text }}>No Content Available</Text>
                  </View>
                )
              }
            />
          </View>
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
    paddingHorizontal: SW(20),
    marginBottom: SH(20),
  },
  sectionTitle: {
    fontSize: SF(20),
    fontWeight: 'bold',
    marginBottom: SH(4),
  },
  sectionSubtitle: {
    fontSize: SF(14),
  },
  contentList: {
    paddingHorizontal: SW(20),
  },
  contentCard: {
    borderRadius: SH(12),
    overflow: 'hidden',
    marginBottom: SH(15),
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SW(12),
    paddingTop: SH(12),
    //borderWidth:1
   // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // zIndex: 2,
  },
  tag: {
    paddingHorizontal: SW(8),
    paddingVertical: SH(4),
    borderRadius: SH(12),
  },
  tagText: {
    color: 'white',
    fontSize: SF(10),
    fontWeight: '600',
  },
  iconContainer: {
    width: SW(32),
    height: SW(32),
    borderRadius: SW(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: SH(160),
    position: 'relative',
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
    height: '30%',
  },
  cardContent: {
    paddingHorizontal: SW(16),
    paddingBottom: SH(16),

  },
  contentTitle: {
    fontSize: SF(16),
    fontWeight: 'bold',
    marginBottom: SH(6),
  },
  contentDescription: {
    fontSize: SF(12),
    lineHeight: SF(16),
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SH(50),
  },
    seeMore: {
      marginTop: 8,
     // color: colors.primary,
      fontWeight: '600',
      fontSize: 14,
    },
});