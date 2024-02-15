import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, Image, Pressable} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome1 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import { getUserData } from '../component/AllFunctions';
import Header from '../component/Header';
import { useTheme } from '@react-navigation/native';

const Settings = props => {
  const [data, setData] = useState('');
  const {colors} = useTheme()
  useEffect(() => {
    getUserData(setData);
  });

  const logoutuser = async () => {
    try {
      await AsyncStorage.removeItem('userid');
      await AsyncStorage.removeItem('name');
      await AsyncStorage.removeItem('mobile');
      props.navigation.navigate('Login');
      console.log('Data removed successfully!');
    } catch (error) {
      console.log('Error removing data: ', error);
    }
  };

  return (
    <View>
      <Header title={'Settings'}/>
      <View>
        <Pressable
          style={{
            paddingHorizontal:20,
            height: 110,
            backgroundColor: colors.card,
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomWidth: 0.15,
          }}
          onPress={() => {
            props.navigation.navigate('profile');
          }}>
          <Image
            style={{height: 90, width: 90, borderRadius: 50, padding: 5}}
            source={
              data.profilePic
                ? {uri: data.profilePic}
                : require('../../assets/image/unknownprofile.jpg')
            }
          />
          <View>
            <Text style={{marginLeft: 15, fontSize: 20, color: colors.text}}>
              {data.name}
            </Text>
            <Text style={{marginLeft: 10, fontSize: 18, color: colors.text}}>
              {data.about}
            </Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => props.navigation.navigate('account')}
          style={{
            height: 70,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <FontAwesome1 name="key" size={22} color={colors.text}/>
          <Text style={{color: colors.text, marginLeft: 20, fontSize: 18}}>
            Account
          </Text>
        </Pressable>
        <Pressable
          onPress={() => props.navigation.navigate('chatsSetting')}
          style={{
            height: 70,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <FontAwesome1 name="message" size={22} color={colors.text}/>
          <Text style={{color: colors.text, marginLeft: 20, fontSize: 18}}>
            Chats
          </Text>
        </Pressable>
        <Pressable
          onPress={() => logoutuser()}
          style={{
            height: 70,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <FontAwesome1 name="lock-open" size={22} color={colors.text}/>
          <Text style={{color: colors.text, marginLeft: 20, fontSize: 18}}>
            Logout
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Settings;
