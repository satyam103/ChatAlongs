import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';
import {Pressable, ScrollView} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Dropdown = props => {
  const toggleDropdown = () => {
    props.setVisible(!props.visible);
  };

  return (
    <Pressable
      style={{width: 20, alignItems: 'center'}}
      onPress={toggleDropdown}>
      <FontAwesome name="ellipsis-v" size={22} color={'white'} />
    </Pressable>
  );
};

export default Dropdown;

export const RenderDropdown = props => {
  const navigation = useNavigation();
  // console.log(props)
  return (
    <View
      style={{
        position: 'absolute',
        backgroundColor: 'rgb(10,20,60)',
        top: 45,
        right: 15,
        width: 180,
        maxHeight: 200,
        borderRadius: 10,
        padding: 10,
      }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {props?.dataList.map((item, index) => {
          return (
            <Pressable
              key={index}
              style={{height: 30,justifyContent:'center'}}
              onPress={() => {
                navigation.navigate(`${item.page}`,props.friendData && {
                  item:{data : props?.friendData}
                });
                props.setDropDown(false);
              }}>
              <Text style={{color: 'white', fontSize: 16}}>{item.name}</Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
