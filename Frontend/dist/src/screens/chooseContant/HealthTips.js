import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContainerComponent from '../../components/commonComponents/Container'
import { useDispatch, useSelector } from 'react-redux'
import { darkColors, lightColors } from '../../utils/Colors'

const HealthTips = () => {
  const themeMode = useSelector((state) => state.theme.theme);
  let colors = (themeMode === 'dark') ? darkColors : lightColors;
  const styles = themedStyles(colors);
  return (
    <ContainerComponent>
    <View>
      <Text>HealthTips</Text>
    </View>
    </ContainerComponent>
  )
}

export default HealthTips

const themedStyles =(colors)=> StyleSheet.create({})