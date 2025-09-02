import { StyleSheet,StatusBar } from 'react-native';
import React from 'react';
import Navigations from './src/navigations/Navigations';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import ContainerComponent from './src/components/commonComponents/Container';
import store from './src/redux/store/store';
import { Provider } from 'react-redux';

const App = () => {
  return (
  <Provider store={store}>
    <ContainerComponent>
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
           <StatusBar
          barStyle={ 'dark-content'}
          backgroundColor='blue'
          //translucent={false} 
        />
        <NavigationContainer>
          <Navigations />
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
    </ContainerComponent>
    </Provider>
  );
};

export default App;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = StyleSheet.create({
   container: {
    flex: 1,
  },
});
