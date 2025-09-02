import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const themeMode = useSelector(state => state.theme.theme);
  const colors = themeMode === 'dark' ? darkColors : lightColors;

  const ContentData = [
    {
      id: 1,
      name: 'My Subjects',
      image:
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D',
    },
    {
      id: 2,
      name: 'Yoga Tips',
      image:
        'https://thumbs.dreamstime.com/b/yoga-woman-doing-sunset-32549843.jpg',
    },
    {
      id: 3,
      name: 'Sports Tips',
      image:
        'https://t3.ftcdn.net/jpg/02/87/04/00/360_F_287040077_U2ckmhpzeyqDHiybj0dfCfX6NRCEKdoe.jpg',
    },
    {
      id: 4,
      name: 'Health Tips',
      image:
        'https://media.istockphoto.com/id/1473675453/photo/well-balanced-diet-and-blood-pressure-control-for-heart-care.jpg?s=612x612&w=0&k=20&c=XUxCIyfmz0YaDzBYY486omFNG80QyHprkFcjw1bMVsg=',
    },
    {
      id: 5,
      name: 'Current Affairs',
      image:
        'https://www.edudwar.com/wp-content/uploads/2021/08/daily-current-affairs.jpg',
    },
    {
      id: 6,
      name: 'My Subjects',
      image:
        'https://images.unsplash.com/photo-1541963463532-d68292c34b19?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D',
    },
  ];

  const contentSelection = () => {
    navigation.navigate('ContentSection');
  };
  return (
    <ContainerComponent>
      <View style={{ flex: 1 }}>
        <View style={styles.ContainerStyle}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={loginImg}
              resizeMode="cover"
              style={{ height: SH(40), width: SW(40), borderRadius: SH(100) }}
            />
            <Text
              style={{
                fontSize: SH(15),
                marginLeft: SW(10),
                color: colors.text,
              }}
            >
              Student Book
            </Text>
          </View>
          <View>
            <TouchableOpacity style={{marginRight:SW(10)}}>
                <Fontisto name="bell" size={25} color="black" />
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.iconButton}
              onPress={() => dispatch(toggleTheme())}
            >
              {themeMode === 'light' ? (
                <FontAwesome5 name="sunny-outline" size={30} color="#000" />
              ) : (
                <FontAwesome5 name="moon-outline" size={30} color="white" />
              )}
            </TouchableOpacity> */}
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingBottom: SH(10) }}>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D',
              }}
              resizeMode="stretch"
              style={{
                height: SH(250),
                width: '100%',
                marginVertical: SH(10),
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: SH(10),
              }}
            >
              <Text style={{ fontSize: SF(16), color: 'white' }}>
                Good Education With Motive Life
              </Text>
            </ImageBackground>
            <View style={{ marginVertical: SH(10) }}>
              <Image
                source={userProfile}
                style={{ height: SH(200), width: SW('100%') }}
              />
            </View>

            <View style={{ marginTop: SH(10), marginHorizontal: SH(10) }}>
              <Text style={[styles.subHeading, { color: colors.text }]}>
                My Content
              </Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={ContentData}
                renderItem={({ item }) => {
                  return (
                    <View>
                      <TouchableOpacity
                        style={styles.ImgCard}
                        onPress={contentSelection}
                      >
                        <Image
                          source={{ uri: item.image }}
                          style={{
                            height: SH(80),
                            width: SW(100),
                            borderRadius: SH(10),
                          }}
                        />
                      </TouchableOpacity>
                      <Text style={[styles.Paratext, { color: colors.text }]}>
                        {item.name}
                      </Text>
                    </View>
                  );
                }}
              />

              <View style={{ marginVertical: SH(15) }}>
                <Text style={[styles.subHeading, { color: colors.text }]}>
                  Continue watching
                </Text>
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  horizontal
                  data={ContentData}
                  renderItem={({ item }) => {
                    return (
                      <View>
                        <TouchableOpacity style={styles.ImgCard}>
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              height: SH(80),
                              width: SW(100),
                              borderRadius: SH(10),
                            }}
                          />
                        </TouchableOpacity>
                        <Text style={[styles.Paratext, { color: colors.text }]}>
                          {item.name}
                        </Text>
                      </View>
                    );
                  }}
                />
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
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
  ContainerStyle: {
    marginVertical: SH(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SH(10),
  },
  subHeading: {
    fontSize: SF(15),
    marginVertical: SH(5),
  },
  Paratext: {
    fontSize: SF(13),
    textAlign: 'center',
  },
  ImgCard: {
    marginRight: SW(10),
    borderRadius: SH(10),
  },
});
