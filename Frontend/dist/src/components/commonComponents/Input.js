import React, { useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
  Text,
} from 'react-native';
import { SH, SF, SW } from '../../utils/dimensions';
import { useSelector } from 'react-redux';
import { darkColors, lightColors } from '../../utils/Colors';

const Input = ({
  value,
  title,
  onChangeHandler,
  onFocusHandler,
  placeholder,
  leftContent,
  rightContent,
  showPassword = false,
  textInputProps,
  placeholderTextColor,
  keyboardType,
  categoryStyles,
  isMultiline,
  editable,
  InputContainerStyle,
  autoFocus,
  maxLength,
  isRight
 }) => {
    //const[isRight,setIsRight] = useState(false)
  const themeMode = useSelector((state) => state.theme.theme);
  let colors = (themeMode === 'dark') ? darkColors : lightColors;
  const styles = themedStyles(colors);
  return (
    <>
      {title && title?.length > 0 && (
        <Text style={categoryStyles ? categoryStyles : [styles.textStyle]}>
          {title}
        </Text>
      )}
      <View
        style={[
         //isRight && styles.inputMainView,
          styles.iputContainer,
        ]}
      > 
        <TextInput
          style={[styles.inputStyles,{width:isRight?'85%':'100%'}]}
          //cursorColor={'blue'}
          onChangeText={text => onChangeHandler(text)}
          onFocus={onFocusHandler}
          placeholder={placeholder}
          placeholderTextColor={colors.grey}
          secureTextEntry={showPassword}
          value={value}
          multiline={isMultiline}
         // placeholderTextColor={placeholderTextColor}
          keyboardType={keyboardType}
          editable={editable}
          autoFocus={autoFocus}
          maxLength={maxLength}
        />
        {rightContent}
      </View>
    </>
  );
};

export default Input;

const themedStyles =(colors)=> StyleSheet.create({
    iputContainer: {
    borderWidth: 1,
    flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
    borderRadius: SH(10),
    paddingVertical: SH(3),
    borderColor:colors.text
  },
  inputStyles: {
  color:colors.text
  },
  textStyle: {
    paddingVertical: SW(2),
    fontFamily: 'Roboto',
    fontSize: SF(15),
    marginTop: SH(8),
      color:colors.text
    //  color: 'blue'
  },

  inputMainView:{
    flexDirection:'row',
    borderWidth:1,
    borderColor:colors.text
  }
});
