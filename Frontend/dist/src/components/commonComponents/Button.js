import React, { useMemo } from 'react';
import { Button } from 'react-native-elements';
import { TouchableOpacity, StyleSheet, } from 'react-native';
import {SF, SH, SW } from '../../utils/dimensions';
import { Colors } from '../../utils/Colors';
import  Fonts  from '../../utils/Fonts';

function Buttons(props) {
  const { title, onPress, buttonStyle, disable, buttonTextStyle, icon, spacedImages, linearGradientProps } = props;
  const styles = useMemo(
    () =>
      StyleSheet.create({
        buttonStyle: {
          backgroundColor: Colors.theme_backgound,
          borderRadius: SH(7),
          width: '100%',
        },
        buttonTextStyle: {
          color: Colors.white_text_color,
          fontFamily: Fonts.Poppins_Medium,
          fontSize: SF(19),
          fontWeight: '600',
          lineHeight: SH(24),
        },
        buttonViewStyle: {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: spacedImages ? 'space-around' : 'center',
          width: '100%'
        },
        LeftImageViewStyle: {
          marginVertical: SW(5)
        }
      }),
    [disable, spacedImages],
  );

  return (
    <TouchableOpacity>
      <Button
        title={title}
        onPress={onPress}
        icon={icon}
        linearGradientProps={linearGradientProps}
        buttonStyle={[styles.buttonStyle, { ...buttonStyle }]}
        titleStyle={[styles.buttonTextStyle, { ...buttonTextStyle }]}
      />
    </TouchableOpacity>
  );
}
export default Buttons;
