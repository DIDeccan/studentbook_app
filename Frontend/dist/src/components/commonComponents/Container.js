import { SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useMemo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Colors, { darkColors, lightColors } from '../../utils/Colors';
import { useDispatch, useSelector } from 'react-redux';

function ContainerComponent({
  children,
  fullScreen,
  statusBarPropStyle,
  containerPropStyle,
}) {
const dispatch = useDispatch();
const themeMode = useSelector((state) => state.theme.theme);
// console.log(themeMode,"===li===theme")
  const colors = (themeMode === 'dark') ? darkColors : lightColors;
//console.log(colors,"==li==colours")

  const styles = useMemo(
    () =>
      StyleSheet.create({
        statusBarStyle: {
          flex: 0,
          backgroundColor: 'transparent',
        },
        containerStyle: {
          flex: 1,
          backgroundColor: 'transparent',
        },
        linearGradient: {
          flex: 1
        },
      }),
    [],
  );
  return fullScreen ? (
    <View style={[styles.containerStyle, { ...containerPropStyle }]}>
      {children}
    </View>
  ) : (
    <View style={[styles.containerStyle, { ...containerPropStyle }]}>
      <LinearGradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        colors={
    themeMode === 'dark'
      ? ['#000000', '#000000'] 
      : ['rgba(254,238,245,1)', 'rgba(223,238,255,1)'] 
  }
        style={styles.linearGradient}>
        <SafeAreaView
          style={[
            styles.statusBarStyle,
            { statusBarPropStyle },
          ]}
        />
        <SafeAreaView style={[styles.containerStyle, { ...containerPropStyle }]}>
          {children}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

export default ContainerComponent;
