import React from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../component/Header';
import { useTheme } from '@react-navigation/native';

const Accounts = props => {
  const {colors} = useTheme()
  return (
    <View>
      <Header title={'Accounts'}/>
      <View style={{padding: 10}}>
        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <Ionicons
            name="mail"
            size={22}
            color= {colors.text}
            style={{width: 20, justifyContent: 'center', alignItems: 'center'}}
          />
          <Text style={{color: colors.text, fontSize: 18, marginLeft: 20}}>
            Email Address
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <FontAwesome
            name="mobile-alt"
            size={22}
            color= {colors.text}
            style={{width: 20, justifyContent: 'center', alignItems: 'center'}}
          />
          <Text style={{color: colors.text, fontSize: 18, marginLeft: 20}}>
            Change number
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 15,
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
          }}>
          <Ionicons
            name="trash"
            size={22}
            color= {colors.text}
            style={{width: 20, justifyContent: 'center', alignItems: 'center'}}
          />
          <Text style={{color: colors.text, fontSize: 18, marginLeft: 20}}>
            Delete Account
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Accounts;
