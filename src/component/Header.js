import { useNavigation } from '@react-navigation/native';
import React from 'react'
import {View, TouchableOpacity, Text} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Header = ({title}) => {
    const navigation = useNavigation()
  return (
    <View
      style={{
        height: 60,
        width: '100%',
        backgroundColor: '#0766AD',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity style={{height:'100%'}} onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={20} color={'white'} />
        </TouchableOpacity>
        <Text style={{color:'white',fontSize:20,marginLeft:10,fontWeight:'bold'}}>{title}</Text>
      </View>
    </View>
  )
}

export default Header
