import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContainerComponent from '../../components/commonComponents/Container'
import { useSelector } from 'react-redux';
import { darkColors, lightColors } from '../../utils/Colors';

const YogaVideosContent = () => {
  const themeMode = useSelector((state) => state.theme.theme);
  let colors = (themeMode === 'dark') ? darkColors : lightColors;
  const styles = themedStyles(colors);
  return (
    <ContainerComponent>
   <View>
      <Text>YogaVideosContent</Text>
    </View>
    </ContainerComponent> 
  )
}

export default YogaVideosContent

const themedStyles =(colors)=> StyleSheet.create({})