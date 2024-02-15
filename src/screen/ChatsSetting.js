import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../component/Header';
import {Divider, RadioButton} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '@react-navigation/native';

const ChatsSetting = props => {
  const [visible, setVisible] = useState(false);
  const [checkedTheme, setCheckedTheme] = useState('System Default');
  const {colors} = useTheme()
  let userid = '';

  const getData = async () => {
    userid = await AsyncStorage.getItem('userid');
    const chatsetting = await firestore()
      .collection('users')
      .doc(userid)
      .collection('setting')
      .doc('chatSetting')
      .get();
    setCheckedTheme(chatsetting.data().theme);
  };
  useEffect(() => {
    getData();
  },[visible]);

  // ========================== change theme ===========================
  const setTheme = async () => {
    try {
      userid = await AsyncStorage.getItem('userid');
      const theme = await firestore()
        .collection('users')
        .doc(userid)
        .collection('setting')
        .doc('chatSetting')
        .update({
          theme:checkedTheme
        });
        props.navigation.navigate('settings')
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View>
      <Header title={'Chats'} style={visible && {opacity: 0.5}} />
      <View style={visible && {opacity: 0.5}}>
        <View
          style={{padding: 20, borderBottomWidth: 0.15, borderColor: 'grey'}}>
          <Text style={{paddingBottom: 10, fontSize: 16,color:colors.text}}>Display</Text>
          <Pressable
            onPress={() => setVisible(true)}
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Ionicons name="flower" size={22} color= {colors.text}/>
            <Text style={{fontSize: 20, color: colors.text, paddingHorizontal: 15}}>
              Theme
            </Text>
          </Pressable>
          <Pressable
            onPress={() => props.navigation.navigate('chatWallpaper')}
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Ionicons name="image" size={22}  color= {colors.text}/>
            <Text style={{fontSize: 20, color: colors.text, paddingHorizontal: 15}}>
              Wallpaper
            </Text>
          </Pressable>
        </View>
        <View style={{padding: 20}}>
          <Pressable
            style={{
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Ionicons name="cloud-upload" size={22} color= {colors.text}/>
            <Text style={{fontSize: 20, color: colors.text, paddingHorizontal: 15}}>
              Chat Backup
            </Text>
          </Pressable>
        </View>
      </View>
      <Modal visible={visible} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setVisible(!visible)}>
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback
              style={{
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  elevation: 5,
                  borderRadius: 15,
                  width: 250,
                  justifyContent: 'center',
                }}>
                <View style={{}}>
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      setCheckedTheme('System Default');
                    }}>
                    <Text style={{fontSize: 16, margin: 10,color:colors.text}}>
                      System Default
                    </Text>
                    <RadioButton
                      value="System Default"
                      status={checkedTheme === 'System Default' && 'checked'}
                      color="blue"
                      onPress={() => {
                        setCheckedTheme('System Default');
                      }}
                    />
                  </Pressable>
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      setCheckedTheme('Light');
                    }}>
                    <Text style={{fontSize: 16, margin: 10,color:colors.text}}>Light Mode</Text>
                    <RadioButton
                      value="Light"
                      status={checkedTheme === 'Light' && 'checked'}
                      color="blue"
                      onPress={() => {
                        setCheckedTheme('Light');
                      }}
                    />
                  </Pressable>
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                    onPress={() => {
                      setCheckedTheme('Dark');
                    }}>
                    <Text style={{fontSize: 16, margin: 10,color:colors.text}}>Dark Mode</Text>
                    <RadioButton
                      value="Dark"
                      status={checkedTheme === 'Dark' && 'checked'}
                      color="blue"
                      onPress={() => {
                        setCheckedTheme('Dark');
                      }}
                    />
                  </Pressable>
                </View>
                <Divider bold={true} />
                <View style={{flexDirection: 'row', alignSelf: 'flex-end'}}>
                  <Pressable
                    style={{margin: 10}}
                    onPress={() => {
                      // getData();
                      setVisible(false);
                    }}>
                    <Text style={{fontWeight: 'bold',color:colors.text}}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={{marginHorizontal: 20,marginVertical:10}}
                    onPress={() => {
                      setTheme()
                      setVisible(false);
                    }}>
                    <Text style={{fontWeight: 'bold',color:colors.text}}>Ok</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ChatsSetting;
