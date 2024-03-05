import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
  Time,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome1 from 'react-native-vector-icons/FontAwesome5';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import Color from 'react-native-gifted-chat/lib/Color';
import * as DocumentPicker from 'react-native-document-picker';
import {
  InChatContactTransfer,
  InChatCurrentLocation,
  InChatFileTransfer,
} from '../component/InChatFileTransfer';
import Dropdown, {RenderDropdown} from '../component/Dropdown';
import {
  downloadDoc,
  getContactSettingData,
  sendNotification,
} from '../component/AllFunctions';
import Geolocation from '@react-native-community/geolocation';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {useSelector} from 'react-redux';

const Chats = props => {
  // console.log(props?.route?.params?.data)
  const [messages, setMessages] = useState([]);
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [dropdown, setDropDown] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [contactChatSetting, setContactChatSetting] = useState();
  const userData = useSelector(state => state.user.userData);
  const allSetting = useSelector(state => state.user.setting);

  useEffect(() => {
    getContactSettingData(
      props.route.params.data.userid,
      setContactChatSetting,
    );
  });
  useEffect(() => {
    console.log(userData);
    const subscriber = firestore()
      .collection('chats')
      .doc('' + userData[0].userid + props.route.params.data.userid)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    subscriber.onSnapshot(querysnapshot => {
      const allmessages = querysnapshot.docs.map(item => {
        return {...item._data, createdAt: item._data.createdAt};
      });
      setMessages(allmessages);
    });
    check(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES).then(res => {
      console.log(res);
      if (res === RESULTS.GRANTED) {
        console.log(res, 'granted');
      } else {
        request(PERMISSIONS.ANDROID.READ_MEDIA_IMAGES).then(res => {
          console.log(res, 'media location');
        });
        // checkPermission();
      }
    });
  }, []);
  // ======================= get location ============================
  const getCurrentLocation = () => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
      if (result === RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            let initialPosition = position;
            if (position) {
              console.log(
                'current locations data ',
                initialPosition?.coords?.latitude +
                  ' ' +
                  initialPosition?.coords?.longitude,
              );
              setUserLatitude(initialPosition?.coords?.latitude);
              setUserLongitude(initialPosition?.coords?.longitude);
              console.log(
                userLatitude + ' Lat ------------------' + userLongitude,
              );
            }
          },
          error => console.log('Error', JSON.stringify(error)),
          {enableHighAccuracy: false, timeout: 20000},
        );
        console.log('Location permission is enabled');
      } else {
        requestAccessLocationPermission();
        console.log('Location permission is not enabled');
      }
    });
  };
  const requestAccessLocationPermission = () => {
    Geolocation.requestAuthorization(() => {
      getCurrentLocation();
      // setLocationEnabled(true);
    });
    if (Platform.OS == 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        if (result === RESULTS.GRANTED) {
          getCurrentLocation();
          // setLocationEnabled(true);
        }
      });
    } else {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        if (result === RESULTS.GRANTED) {
          getCurrentLocation();
          // setLocationEnabled(true);
        }
      });
    }
  };
  const checkPermission = () => {
    request(PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION).then(res => {
      console.log(res, 'fdshgf');
      if (res === RESULTS.GRANTED) {
        console.log(res, 'granted');
      }
    });
  };
  // ===================== select document ===========================
  const _pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
        mode: 'import',
        allowMultiSelection: true,
      });
      const fileUri = result[0].fileCopyUri;
      console.log('file============+', fileUri);
      let tempArray = [];
      result.forEach((item, index) => {
        console.log(JSON.stringify(item, null, 2));
        if (
          item.type === 'image/jpeg' ||
          item.type === 'image/jpg' ||
          item.type === 'image/png'
        ) {
          let file = {
            uri: item.fileCopyUri,
            fileUri: item.fileCopyUri,
            size: item.size,
            name: item.name,
            imageIndex: index,
            type: item.type,
          };
          tempArray.push(file);
        } else {
          let file = {
            fileUri: item.fileCopyUri,
            size: item.size,
            name: item.name,
            imageIndex: index,
            type: item.type,
            uri: 'https://firebasestorage.googleapis.com/v0/b/chatalong-fcc16.appspot.com/o/images%2Fpdf.png?alt=media&token=fb9ea7e3-efd8-4a5e-b0f3-ba31af316a29',
          };
          tempArray.push(file);
        }
      });
      props.navigation.navigate('SendDocs', {
        data: tempArray,
        userdata: props?.route?.params?.data,
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('DocumentPicker err => ', err);
        throw err;
      }
    }
  };
  // ======================= choose image from gallery =========================
  const selectImage = () => {
    ImagePicker.openPicker({
      width: 200,
      height: 200,
      compressImageMaxHeight: 400,
      compressImageMaxWidth: 400,
      cropping: true,
      freeStyleCropEnabled: true,
      multiple: true,
    }).then(response => {
      let tempArray = [];
      response.forEach((item, index) => {
        let image = {
          uri: item.path,
          width: item.width,
          height: item.height,
          imageIndex: index,
        };
        tempArray.push(image);
      });
      props.navigation.navigate('SendImages', {
        data: tempArray,
        userdata: props?.route?.params?.data,
      });
    });
  };
  // =========================== capture using camera ===========================
  const selectCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      freeStyleCropEnabled: true,
      multiple: true,
    }).then(response => {
      let tempArray = [];
      let image = {
        uri: response.path,
        width: response.width,
        height: response.height,
      };
      tempArray.push(image);
      props.navigation.navigate('SendImages', {
        data: tempArray,
        userdata: props?.route?.params?.data,
      });
    });
  };
  const onSend = async (messages = []) => {
    const msg = messages[0];
    // console.log(msg);
    let mymsg = {
      ...msg,
      sendBy: userData[0].userid,
      sendTo: props.route.params.data.userid,
      createdAt: Date.parse(msg.createdAt),
      sent: true,
    };
    setMessages(previousMessages => GiftedChat.append(previousMessages, mymsg));
    firestore()
      .collection('chats')
      .doc('' + userData[0].userid + props.route.params.data.userid)
      .collection('messages')
      .add(mymsg);
    firestore()
      .collection('chats')
      .doc('' + props.route.params.data.userid + userData[0].userid)
      .collection('messages')
      .add(mymsg);
    sendNotification({
      message: {
        token: props?.route?.params?.data?.fcmToken,
        notification: {
          body: msg.text,
          title: userData[0].name,
          imageurl: userData[0].profilePic,
        },
        data: {
          senderID: userData[0].userid,
          messageId: msg._id,
          type: 'Chats',
        },
      },
    });
  };
  const renderSend = props => {
    return (
      <View style={{flexDirection: 'row'}}>
        <Send
          {...props}
          containerStyle={{height: 44, justifyContent: 'center', bottom: 3}}>
          <FontAwesome
            name="send"
            size={25}
            color={'white'}
            style={{
              marginHorizontal: 10,
              backgroundColor: 'green',
              padding: 10,
              borderRadius: 50,
            }}
          />
        </Send>
      </View>
    );
  };
  const renderBubble = props => {
    const {currentMessage} = props;
    if (currentMessage.fileUri && currentMessage.fileName) {
      console.log(props.currentMessage.user._id === userData[0].userid);
      return (
        <TouchableOpacity
          onPress={() => downloadDoc(currentMessage)}
          style={{
            ...styles.fileContainer,
            backgroundColor:
              props.currentMessage.user._id === userData[0].userid
                ? Color.defaultBlue
                : 'rgba(255,255,255,1)',
            borderRadius: 5,
            width: '80%',
            marginLeft: 10,
          }}>
          <InChatFileTransfer
            style={{marginTop: -10}}
            currentMessage={currentMessage}
            userdata={userData[0].userid}
          />
          <View>
            <Time
              currentMessage={currentMessage}
              position={
                props.currentMessage.user._id === userData[0].userid
                  ? 'right'
                  : 'left'
              }
            />
          </View>
        </TouchableOpacity>
      );
    }
    if (currentMessage.contactDetail) {
      return (
        <View
          style={{
            ...styles.fileContainer,
            backgroundColor:
              props.currentMessage.user._id === userData[0].userid
                ? Color.defaultBlue
                : 'rgba(255,255,255,1)',
            borderRadius: 5,
            width: '80%',
            marginLeft: 10,
          }}>
          <InChatContactTransfer
            style={{marginTop: -10}}
            currentMessage={currentMessage}
            userdata={userData[0].userid}
          />
        </View>
      );
    }
    if (currentMessage.location) {
      return (
        <View
          style={{
            ...styles.fileContainer,
            backgroundColor:
              props.currentMessage.user._id === userData[0].userid
                ? Color.defaultBlue
                : 'rgba(255,255,255,1)',
            borderRadius: 5,
            maxWidth: '80%',
            marginLeft: 10,
          }}>
          <InChatCurrentLocation
            style={{marginTop: -10}}
            currentMessage={currentMessage}
            userdata={userData[0].userid}
          />
          <View>
            <Time
              currentMessage={currentMessage}
              position={
                props.currentMessage.user._id === userData[0].userid
                  ? 'right'
                  : 'left'
              }
              containerStyle={{
                left: StyleSheet.create({
                  marginLeft: 10,
                }),
              }}
            />
          </View>
        </View>
      );
    }
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: 'rgb(255,255,255)',
            marginRight: 60,
            marginLeft: 10,
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  };
  const scrollToBottomComponent = () => {
    return <FontAwesome name="angle-double-down" size={22} color="#333" />;
  };
  const renderComposer = props => {
    return (
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
        <Pressable
          style={{
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            paddingBottom: 12,
          }}>
          <FontAwesome1 name="grin-alt" size={22} color={'grey'} />
        </Pressable>
        <Composer {...props} textInputStyle={{bottom: 0, color: 'black'}} />
        <TouchableOpacity
          style={{
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            paddingBottom: 12,
          }}
          onPress={() => setModalVisible(!modalVisible)}>
          <FontAwesome
            name="paperclip"
            size={25}
            color={'black'}
            style={{
              marginRight: 10,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const renderInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: 'rgba(0,0,0,0)',
          borderTopWidth: 0,
          bottom: 2.3,
          height: 55,
          justifyContent: 'flex-end',
          paddingHorizontal: 5,
        }}
      />
    );
  };
  const renderLoading = props => {
    return (
      <View
        style={{height: '90%', alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator color={'white'} size={'large'} />
      </View>
    );
  };
  const menu = [
    {name: 'View Profile', page: 'friendsProfilePage'},
    {name: 'Media, links, and docs', page: 'profile'},
    {name: 'Wallpaper', page: 'chatWallpaper'},
    {name: 'More', page: 'friendsProfilePage'},
  ];

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: 60,
          width: '100%',
          backgroundColor: '#0766AD',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingRight: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              width: 40,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => props.navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color={'white'} />
          </TouchableOpacity>
          <Pressable
            onPress={() =>
              props.navigation.navigate('friendsProfilePage', {
                item: {
                  data: props?.route?.params?.data,
                },
              })
            }
            style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={
                props.route.params.data && props.route.params.data.profilePic
                  ? {uri: props.route.params.data.profilePic}
                  : require('../../assets/image/unknownprofile.jpg')
              }
              style={{height: 40, width: 40, borderRadius: 20}}
            />
            <Text
              style={{
                color: 'white',
                marginHorizontal: 8,
                fontSize: 20,
              }}>
              {props.route.params.data.name}
            </Text>
          </Pressable>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Pressable
            onPress={() =>
              props.navigation.navigate('Call', {
                userid: userData[0].userid,
                call: 'voice call',
              })
            }>
            <FontAwesome name="phone" color={'white'} size={20} />
          </Pressable>
          <Pressable
            onPress={() =>
              props.navigation.navigate('Call', {
                userid: userData[0].userid,
                call: 'agora',
              })
            }>
            <FontAwesome
              name="video-camera"
              color={'white'}
              size={20}
              style={{marginHorizontal: 20}}
            />
          </Pressable>
          <Dropdown visible={dropdown} setVisible={setDropDown} />
        </View>
      </View>
      <ImageBackground
        source={
          contactChatSetting && contactChatSetting.backgroundImage
            ? {uri: contactChatSetting.backgroundImage}
            : allSetting && allSetting.backgroundImage
            ? {uri: allSetting.backgroundImage}
            : require('../../assets/image/chatBackground.jpg')
        }
        style={{flex: 1}}
        imageStyle={{
          opacity:
            1 -
            (contactChatSetting && contactChatSetting.wallpaperOpacity
              ? contactChatSetting.wallpaperOpacity
              : allSetting && allSetting.wallpaperOpacity
              ? allSetting.wallpaperOpacity
              : 0),
        }}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: userData[0].userid,
          }}
          renderBubble={renderBubble}
          alwaysShowSend
          scrollToBottom
          renderSend={renderSend}
          alignTop={true}
          isLoadingEarlier={true}
          scrollToBottomComponent={scrollToBottomComponent}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderAvatar={null}
          renderLoading={renderLoading}
          textInputStyle={{
            color: 'black',
            paddingHorizontal: 5,
            marginTop: Platform.select({
              ios: 5,
              android: 3,
              web: 4,
            }),
          }}
        />
      </ImageBackground>
      {dropdown && (
        <RenderDropdown
          dataList={menu}
          friendData={props.route.params.data}
          setDropDown={setDropDown}
          dropdown={dropdown}
        />
      )}
      {modalVisible && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          style={{
            height: '100%',
            justifyContent: 'flex-end',
            position: 'relative',
          }}>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={{
                alignSelf: 'center',
                height: '100%',
                width: '100%',
                justifyContent: 'flex-end',
                alignItems: 'center',
                bottom: 65,
              }}>
              <TouchableWithoutFeedback>
                <View
                  style={{
                    backgroundColor: 'rgb(50,60,90)',
                    elevation: 5,
                    width: '92%',
                    borderRadius: 10,
                    alignItems: 'center',
                    paddingVertical: 20,
                  }}>
                  <View
                    style={{
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      // width: 210,
                      paddingVertical: 10,
                    }}>
                    <Pressable
                      onPress={() => {
                        setModalVisible(false);
                        _pickDocument();
                      }}
                      style={{}}>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 50,
                          marginHorizontal: 5,
                          backgroundColor: 'rgb(125,105,235)',
                        }}>
                        <Ionicons name="document" size={22} color={'white'} />
                      </View>
                      <View>
                        <Text style={{color: 'white'}}>Document</Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setModalVisible(false);
                        selectCamera();
                      }}
                      style={{
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 50,
                          backgroundColor: 'rgb(215,25,25)',
                          marginHorizontal: 20,
                        }}>
                        <Ionicons name="camera" size={22} color={'white'} />
                      </View>
                      <Text style={{color: 'white'}}>camera</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setModalVisible(false);
                        selectImage();
                      }}
                      style={{
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 50,
                          marginHorizontal: 5,
                          backgroundColor: 'rgb(205,65,255)',
                        }}>
                        <FontAwesome name="photo" size={22} color={'white'} />
                      </View>
                      <Text style={{color: 'white'}}>Gallery</Text>
                    </Pressable>
                  </View>
                  <View
                    style={{
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      width: 210,
                      paddingVertical: 10,
                    }}>
                    <Pressable
                      onPress={() => {
                        setModalVisible(false);
                        props.navigation.navigate('shareContact', {
                          userdata: props?.route?.params?.data,
                        });
                      }}
                      style={{
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 50,
                          marginHorizontal: 5,
                          backgroundColor: 'aqua',
                        }}>
                        <Ionicons name="person" size={22} color={'white'} />
                      </View>
                      <Text style={{color: 'white'}}>Contact</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setModalVisible(false);
                        props.navigation.navigate('sendLocation', {
                          userdata: props?.route?.params?.data,
                          setMessages: setMessages,
                        });
                      }}
                      style={{
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          height: 50,
                          width: 50,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 50,
                          backgroundColor: 'green',
                          marginHorizontal: 25,
                        }}>
                        <Ionicons name="location" size={22} color={'white'} />
                      </View>
                      <Text style={{color: 'white'}}>Location</Text>
                    </Pressable>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  chatFooter: {
    shadowColor: '#1F2687',
    shadowOpacity: 0.37,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.18)',
    flexDirection: 'row',
    padding: 5,
    backgroundColor: 'blue',
    bottom: 2,
  },
  buttonFooterChat: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    right: 3,
    top: -2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  buttonFooterChatImg: {
    width: 35,
    height: 35,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    borderColor: 'black',
    left: 66,
    top: -4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  textFooterChat: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
});

export default Chats;
