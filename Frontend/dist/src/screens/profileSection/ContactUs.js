import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContainerComponent from '../../components/commonComponents/Container'
import { useSelector } from 'react-redux';
import { darkColors, lightColors } from '../../utils/Colors';
import { SF, SH } from '../../utils/dimensions';

const ContactUs = () => {
  const themeMode = useSelector((state) => state.theme.theme);
  let colors = (themeMode === 'dark') ? darkColors : lightColors;
  const styles = themedStyles(colors);
  return (
    <ContainerComponent>
  <Text style={styles.title}>Contact Us</Text>
    </ContainerComponent>
  )
}

export default ContactUs
const themedStyles =(colors)=> StyleSheet.create({
  title:{
    fontSize:SF(20),
    color:colors.text,
    fontWeight:'700',
    textAlign:'center',
    paddingHorizontal:SH(10)
  }
})