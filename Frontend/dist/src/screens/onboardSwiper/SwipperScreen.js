import { StyleSheet, Text, View, ScrollView,TouchableOpacity } from 'react-native';
import React, { useMemo } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useTranslation } from 'react-i18next';
import { Swiper_First, Swiper_Three, Swiper_Two } from '../../images';
import { useTheme } from '@react-navigation/native';
import SwiperStyles from './Swiperscreenstyle';
import ContainerComponent from '../../components/commonComponents/Container';
import Buttons from '../../components/commonComponents/Button';
import CheckBoxset from '../../components/commonComponents/LottieAnimation';
import Styles from '../../components/commonComponents/CommonStyles';

const SwipperScreen = props => {
  const { t } = useTranslation();
  const { navigation } = props;
  const { Colors } = useTheme();
  const SwiperStyle = useMemo(() => SwiperStyles(Colors), [Colors]);

  const Swiperdata = [
    {
      key: 's1',
      text: 'Swiper_title_1',
      title: 'Swiper_title_2',
      animation: Swiper_First,
      backgroundColor: 'transparent',
    },
    {
      key: 's2',
      text: 'Swiper_title_3',
      title: 'Swiper_title_4',
      animation: Swiper_Two,
      backgroundColor: 'transparent',
    },
    {
      key: 's3',
      text: 'Swiper_title_5',
      title: 'Swiper_title_6',
      animation: Swiper_Three,
      backgroundColor: 'transparent',
    },
  ];

  const RenderItem = ({ item }) => {
    return (
      <ContainerComponent>
        <View style={SwiperStyle.minstyleviewphotograpgy}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={Styles.scrollviewstyles}
          >
            <Text style={SwiperStyle.titleStyle}>{t(item.title)}</Text>
            <View style={SwiperStyle.imagset}>
              <CheckBoxset source={item.animation} />
            </View>
            <Text style={SwiperStyle.textstyle}>{t(item.text)}</Text>
          </ScrollView>
        </View>
      </ContainerComponent>
    );
  };

  const _renderNextButton = () => {
    return (
      <View style={SwiperStyle.setbgbuttondiv}>
        <Text style={SwiperStyle.nextbuttoncolorset}>{t('Next_Started')}</Text>
      </View>
    );
  };

  const _renderSkipButton = () => {
    return (
      <View style={SwiperStyle.setbgbuttondiv}>
        <TouchableOpacity
          onPress={() => navigation.navigate('LandingPage')}
        >
          <Text style={SwiperStyle.nextbuttoncolorset}>
            {t('Skip_Started')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  const _renderDoneButton = () => {
    return (
      <Buttons
        title={t('Get_Started')}
        buttonStyle={SwiperStyle.buttonStyle}
        onPress={() => navigation.navigate('LandingPage')}
      />
    );
  };
  return (
    <>
      <AppIntroSlider
        data={Swiperdata}
        renderItem={RenderItem}
        renderNextButton={_renderNextButton}
        renderSkipButton={_renderSkipButton}
        renderDoneButton={_renderDoneButton}
        showSkipButton={true}
        activeDotStyle={SwiperStyle.avtivedotsstyle}
        dotStyle={SwiperStyle.dotstyleset}
      />
    </>
  );
};

export default SwipperScreen;

const styles = StyleSheet.create({});
