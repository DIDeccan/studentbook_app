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
          secureTextEntry={showPassword}
          value={value}
          multiline={isMultiline}
          placeholderTextColor={placeholderTextColor}
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

const styles = StyleSheet.create({
    iputContainer: {
    borderWidth: 1,
    flexDirection: 'row',
     alignItems: 'center',
     justifyContent: 'space-between',
    // borderColor: 'blue',
     // backgroundColor: 'white',
  //  width: SW('90%'),
    borderRadius: SH(10),
    paddingVertical: SH(3),
  },
  inputStyles: {
    //flexDirection: 'row',
   // alignItems: 'center',
    //borderWidth: 1,
    //borderRadius: 8,
   // paddingHorizontal: 2,
    //width: '100%',
  },
  textStyle: {
    paddingVertical: SW(2),
    fontFamily: 'Roboto',
    fontSize: SF(15),
    marginTop: SH(8),
    //  color: 'blue'
  },

  inputMainView:{
    flexDirection:'row',
    borderWidth:1
  }
});
