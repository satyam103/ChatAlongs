import React, {useEffect, useState} from 'react';
import {ImageBackground, Pressable, Text, TextInput, View} from 'react-native';
import Header from '../component/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome1 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {openPicker} from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Slider} from 'react-native-elements';
import { useTheme } from '@react-navigation/native';

const Wallpaper = () => {
  const {colors} = useTheme()
  let userid = '';
  const [bgImage, setBgImage1] = useState();
  const [opacityValue, setOpacityValue] = useState(0);
  useEffect(() => {
    const getData = async () => {
      userid = await AsyncStorage.getItem('userid');
      const chatsettingData = await firestore()
        .collection('users')
        .doc(userid)
        .collection('setting')
        .doc('chatSetting')
        .get();
      setBgImage1(chatsettingData.data().backgroundImage);
      setOpacityValue(chatsettingData.data().wallpaperOpacity);
    };
    getData();
  });
  const setBgImage = async imagepath => {
    try {
      const background = await firestore()
        .collection('users')
        .doc(userid)
        .collection('setting')
        .doc('chatSetting')
        .update({
          backgroundImage: imagepath,
        });
    } catch (error) {
      console.log(error);
    }
  };
  const setBackgroundOpacity = async value => {
    try {
      setOpacityValue(value);
      const backopacity = await firestore()
        .collection('users')
        .doc(userid)
        .collection('setting')
        .doc('chatSetting')
        .update({
          wallpaperOpacity: value,
        });
    } catch (error) {
      console.log(error);
    }
  };
  const choosegallery = () => {
    openPicker({
      width: 300,
      height: 400,
      cropping: true,
      // includeBase64: true,
    })
      .then(image => {
        setBgImage(image.path);
        setBgImage1(image.path);
      })
      .catch(error => {});
  };
  return (
    <View>
      <Header title={'Wallpaper'} />
      <View>
        <Pressable
          onPress={() => choosegallery()}
          style={{
            height: 500,
            width: 260,
            alignSelf: 'center',
            marginTop: 10,
            borderRadius: 10,
            borderWidth: 1,
          }}>
          <View
            style={{
              height: 30,
              width: '100%',
              backgroundColor: '#0766AD',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              borderTopLeftRadius: 9,
              borderTopRightRadius: 9,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View>
                <Ionicons name="arrow-back" size={14} color={'white'} />
              </View>
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  marginLeft: 5,
                }}>
                Contact Name
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}>
            <ImageBackground
              source={
                bgImage
                  ? {uri: bgImage}
                  : require('../../assets/image/chatBackground.jpg')
              }
              style={{flex: 1}}
              imageStyle={{
                borderBottomLeftRadius: 9,
                borderBottomRightRadius: 9,
                opacity: 1 - opacityValue,
              }}>
              <View style={{height: '92%'}}>
                <View
                  style={{
                    fontSize: 12,
                    backgroundColor: 'grey',
                    height: 30,
                    width: 70,
                    alignSelf: 'center',
                    borderRadius: 10,
                    marginTop: 5,
                  }}></View>
                <View style={{alignItems: 'flex-start'}}>
                  <View
                    style={{
                      backgroundColor: 'grey',
                      marginRight: 30,
                      marginLeft: 10,
                      borderRadius: 15,
                      height: 60,
                      width: 160,
                      marginTop: 10,
                      justifyContent: 'flex-end',
                    }}>
                    <View accessibilityRole="text">
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                          }}></View>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <View
                    style={{
                      backgroundColor: 'rgb(20,100,255)',
                      marginRight: 10,
                      marginLeft: 30,
                      borderRadius: 15,
                      height: 60,
                      width: 160,
                      marginTop: 10,
                      justifyContent: 'flex-end',
                    }}>
                    <View accessibilityRole="text">
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                          }}></View>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{flexDirection: 'row', marginHorizontal: 5}}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    backgroundColor: 'rgb(200,200,200)',
                    borderRadius: 30,
                    paddingHorizontal: 10,
                    alignItems: 'flex-end',
                    marginTop: 5,
                    bottom: 3,
                  }}>
                  <View
                    style={{
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      paddingBottom: 6,
                    }}>
                    <FontAwesome1 name="grin-alt" size={14} color={'grey'} />
                  </View>
                  <TextInput
                    placeholder="Enter message"
                    editable={false}
                    style={{
                      height: 30,
                      padding: 3,
                      paddingHorizontal: 10,
                      width: '90%',
                    }}
                  />
                  <View
                    style={{
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                      paddingBottom: 8,
                    }}>
                    <FontAwesome
                      name="paperclip"
                      size={14}
                      color={'black'}
                      style={{
                        // marginBottom: 10,
                        marginRight: 10,
                      }}
                    />
                  </View>
                </View>
                <View>
                  <FontAwesome
                    name="send"
                    size={14}
                    color={'white'}
                    style={{
                      marginLeft: 3,
                      backgroundColor: 'green',
                      padding: 8,
                      borderRadius: 50,
                    }}
                  />
                </View>
              </View>
            </ImageBackground>
          </View>
        </Pressable>
        <Pressable
          onPress={() => choosegallery()}
          style={{
            marginVertical: 10,
            alignItems: 'center',
            padding: 10,
            backgroundColor: 'rgba(200,180,200,0.5)',
            marginHorizontal: 10,
          }}>
          <Text style={{fontWeight: 'bold', color: colors.text}}>Change</Text>
        </Pressable>

        <View
          style={{height: 100, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 250}}>
            <Text style={{fontWeight: 'bold' ,color: colors.text}}>Wallpaper opacity</Text>
          </View>
          <Slider
            maximumValue={1}
            minimumValue={0}
            step={0.1}
            value={opacityValue}
            onValueChange={value => setBackgroundOpacity(value)}
            thumbStyle={{backgroundColor: 'green', height: 20, width: 20}}
            trackStyle={{width: 250, backgroundColor: 'white'}}
            minimumTrackTintColor="green"
            allowTouchTrack
          />
        </View>
      </View>
    </View>
  );
};

export default Wallpaper;
