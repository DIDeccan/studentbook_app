import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import ContainerComponent from '../../components/commonComponents/Container';
import { ImageBackground } from 'react-native';
import { childrenImg, loginImg, userProfile } from '../../images';
import { SF, SH, SW } from '../../utils/dimensions';
import { ScrollView } from 'react-native';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../redux/reducer/themeReducer';
import { darkColors, lightColors } from '../../utils/Colors';
import FontAwesome5 from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AmazonAdsCarousel from '../../components/commonComponents/AmazonAdsCard';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector(state => state.theme.theme);
  const colors = themeMode === 'dark' ? darkColors : lightColors;

  const ContentData = [
    {
      id: 1,
      name: 'My Subjects',
      image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D',
      icon: 'book',
    },
    {
      id: 2,
      name: 'Yoga Tips',
      image: 'https://thumbs.dreamstime.com/b/yoga-woman-doing-sunset-32549843.jpg',
      icon: 'self-improvement',
    },
    {
      id: 3,
      name: 'Sports Tips',
      image: 'https://t3.ftcdn.net/jpg/02/87/04/00/360_F_287040077_U2ckmhpzeyqDHiybj0dfCfX6NRCEKdoe.jpg',
      icon: 'sports-basketball',
    },
    {
      id: 4,
      name: 'Health Tips',
      image: 'https://media.istockphoto.com/id/1473675453/photo/well-balanced-diet-and-blood-pressure-control-for-heart-care.jpg?s=612x612&w=0&k=20&c=XUxCIyfmz0YaDzBYY486omFNG80QyHprkFcjw1bMVsg=',
      icon: 'favorite',
    },
    {
      id: 5,
      name: 'Current Affairs',
      image: 'https://www.edudwar.com/wp-content/uploads/2021/08/daily-current-affairs.jpg',
      icon: 'article',
    },
    {
      id: 6,
      name: 'Study Materials',
      image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHN0dWR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
      icon: 'menu-book',
    },
  ];

  const contentSelection = (item) => {
    //navigation.navigate('ContentSection');
  if (item.id === 1) {
    navigation.navigate("ContentSection", { item });
  } else if (item.id === 2) {
    navigation.navigate("YogaVideos", { item });
  } else {
    navigation.navigate("HealthTips", { item });
  }
  };

  const renderContentItem = ({ item }) => {
    return (
      <TouchableOpacity 
        style={[styles.contentCard, { backgroundColor: colors.cardBackground }]}
        onPress={()=>contentSelection(item)}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.contentImage}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          />
          <View style={styles.iconContainer}>
            <MaterialIcons name={item.icon} size={24} color="white" />
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
      <View style={[styles.container, { }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={loginImg}
              resizeMode="cover"
              style={styles.logo}
            />
            <Text style={[styles.appName, { color: colors.text }]}>
              Student Book
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton}>
              <Fontisto name="bell" size={22} color={colors.text} />
              <View style={[styles.notificationBadge, { backgroundColor: colors.primary }]} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => dispatch(toggleTheme())}
            >
              {themeMode === 'light' ? (
                <FontAwesome5 name="moon-outline" size={22} color={colors.text} />
              ) : (
                <FontAwesome5 name="sunny-outline" size={22} color={colors.text} />
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
                <Text style={[styles.seeAllText, { color: colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={ContentData}
              renderItem={renderContentItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.contentList}
            />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Continue Watching
              </Text>
              <TouchableOpacity>
                <Text style={[styles.seeAllText, { color: colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={ContentData.slice(0, 4)}
              renderItem={renderContentItem}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={styles.contentList}
            />
          </View>

          {/* Featured Section */}
          <View style={[styles.featuredContainer, { backgroundColor: colors.cardBackground }]}>
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
    width: SW(120),
    marginRight: SW(15),
    borderRadius: SH(12),
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    position: 'relative',
    height: SH(100),
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