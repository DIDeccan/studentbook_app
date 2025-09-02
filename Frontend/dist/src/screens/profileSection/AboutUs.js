import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ContainerComponent from '../../components/commonComponents/Container'
import { SF, SH } from '../../utils/dimensions'
import Fonts from '../../utils/Fonts'

const AboutUs = () => {
  return (
      <ContainerComponent>
      <View style={{flex:1, padding:SH(10)}} >
        <Text style={{fontSize:SF(20),textAlign:'center',paddingBottom:SH(10),fontFamily:Fonts.Bold}}>About Us</Text>
        <View style={{backgroundColor:'#fff',borderRadius:10,padding:10,elevation:1}}>
            <Text style={{fontSize:SF(15)}}>Key Takeaways
Here’s a quick summary of everything you need to know about website’s terms and conditions agreements:
Terms and conditions agreements inform users about the rules and expectations for using a website or app.
These agreements are also where you can establish and communicate your governing laws and dispute resolutions.
It may hold up in court so long as long as your rules fall within applicable laws and users read and agreed to it.</Text>
        </View>
      </View>
    </ContainerComponent>
  )
}

export default AboutUs

const styles = StyleSheet.create({})