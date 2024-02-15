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
import {useTheme} from '@react-navigation/native';
import {Image} from 'react-native';
import {
  getAllSettingData,
  getContactSettingData,
} from '../component/AllFunctions';

let userid = '';
let collection = '';
const ChatWallpaper = props => {
  const [bgImage, setBgImage] = useState();
  const [allSetting, setAllSetting] = useState();
  const [contactSettingData, setContactSettingData] = useState();
  const [opacityValue, setOpacityValue] = useState(0);
  const [friendsdata, setFriendsdata] = useState();
  const {colors} = useTheme();

  useEffect(() => {
    const getData = async () => {
      userid = await AsyncStorage.getItem('userid');
      collection =
        props?.route?.params && props.route.params.friendData
          ? 'chats'
          : 'users';
    };
      props?.route?.params?.item?.data &&
      setFriendsdata(props.route.params.item?.data);

      props?.route?.params?.item?.data &&
      getContactSettingData(friendsdata?.userid, setContactSettingData);
    getAllSettingData(setAllSetting);
    getData();
  });

  //   ========================== change wallpaper ================================
  const choosegallery = () => {
    openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        const docId =
          props?.route?.params && props.route.params.friendData
            ? userid + props.route.params.friendData.userid
            : userid;
        setBackgroundImage({imagePath: image.path, docId});
      })
      .catch(error => {});
  };
  const setBackgroundImage = async ({imagePath, docId}) => {
    const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
    const reference = storage().ref(`backgroundWallpaper/${fileName}`);
    try {
      await reference.putFile(imagePath);
      const downloadURL = await reference.getDownloadURL();
      firestore()
        .collection(collection)
        .doc(docId)
        .collection('setting')
        .doc('chatSetting')
        .set(
          {
            backgroundImage: downloadURL,
          },
          {merge: true},
        );
    } catch (error) {}
  };

  //   =================== change opacity ==============================================================
  const setOpacity = async value => {
    const docId =
      props?.route?.params && props?.route?.params?.item?.data
        ? userid + props?.route?.params?.item?.data.userid
        : userid;
    setBackgroundOpacity({value: value, docId});
  };
  const setBackgroundOpacity = async ({value, docId}) => {
    try {
      setOpacityValue(value);
      const backopacity = await firestore()
        .collection(collection)
        .doc(docId)
        .collection('setting')
        .doc('chatSetting')
        .set(
          {
            wallpaperOpacity: value,
          },
          {merge: true},
        );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      <Header
        title={
          props?.route?.params && props?.route?.params?.item?.data
            ? 'Chat Wallpaper'
            : 'Wallpaper'
        }
      />
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
              <Image
                source={
                  friendsdata && friendsdata.profilePic
                    ? {uri: friendsdata.profilePic}
                    : require('../../assets/image/unknownprofile.jpg')
                }
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 20,
                  marginLeft: 8,
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 14,
                  marginLeft: 5,
                }}>
                {friendsdata && friendsdata.name
                  ? friendsdata.name
                  : 'Contact Name'}
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
                contactSettingData && contactSettingData.backgroundImage
                  ? {uri: contactSettingData.backgroundImage}
                  : allSetting && allSetting.backgroundImage
                  ? {uri: allSetting.backgroundImage}
                  : require('../../assets/image/chatBackground.jpg')
              }
              style={{flex: 1}}
              imageStyle={{
                borderBottomLeftRadius: 9,
                borderBottomRightRadius: 9,
                opacity:
                  contactSettingData && contactSettingData.wallpaperOpacity
                    ? 1 - contactSettingData.wallpaperOpacity
                    : allSetting && allSetting.wallpaperOpacity
                    ? 1 - allSetting.wallpaperOpacity
                    : 1 - opacityValue,
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
            <Text style={{fontWeight: 'bold', color: colors.text}}>
              Wallpaper opacity
            </Text>
          </View>
          <Slider
            maximumValue={1}
            minimumValue={0}
            step={0.1}
            value={
              contactSettingData && contactSettingData.wallpaperOpacity
                ? contactSettingData.wallpaperOpacity
                : allSetting && allSetting.wallpaperOpacity
                ? allSetting.wallpaperOpacity
                : opacityValue
            }
            onValueChange={value => {
              setOpacity(value);
            }}
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

export default ChatWallpaper;
