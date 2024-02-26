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
import {StyleSheet} from 'react-native';
import Routing from './src/routing/Routing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import {PermissionsAndroid} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/redux/store/Store';

//
function App() {
  const [theme, setTheme] = useState();
  useEffect(() => {
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
    data();
    getPermission();
  });

  const getPermission = () => {
    [
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS)
        .then(res => {
          console.log('Permission: ', res);
        })
        .catch(error => {
          console.error('Permission error: ', error);
        }),
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
        .then(res => {
          console.log('Permission: ', res);
        })
        .catch(error => {
          console.error('Permission error: ', error);
        }),
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      )
        .then(res => {
          console.log('Permission: ', res);
        })
        .catch(error => {
          console.error('Permission error: ', error);
        }),
    ];
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

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

export default App;
