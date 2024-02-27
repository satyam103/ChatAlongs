/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import Routing from './src/routing/Routing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {Provider} from 'react-redux';
import store from './src/redux/store/Store';
import {getPermission} from './src/component/AllFunctions';

//
function App() {
  const [theme, setTheme] = useState();
  useEffect(() => {
    data();
    getPermission();
  });
  const data = async () => {
    const userid = await AsyncStorage.getItem('userid');
    const settingData = await firestore()
      .collection('users')
      .doc(userid)
      .collection('setting')
      .doc('chatSetting')
      .get();
    setTheme(await settingData.data().theme);
  };

  const appTheme = theme == 'Dark' ? DarkTheme : DefaultTheme;
  return (
    <Provider store={store}>
      <NavigationContainer theme={appTheme}>
        <Routing />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
