import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  Bubble,
  Composer,
  GiftedChat,
  InputToolbar,
  Send,
} from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
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
} from 'react-native';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import * as DocumentPicker from 'react-native-document-picker';
import InChatFileTransfer from '../component/InChatFileTransfer';
import uuid from 'react-native-uuid';
import Dropdown, {RenderDropdown} from '../component/Dropdown';
import {
  getAllSettingData,
  getContactSettingData,
} from '../component/AllFunctions';

const Chats = props => {
  const [messages, setMessages] = useState([]);
  const [isAttachImage, setIsAttachImage] = useState(false);
  const [isAttachFile, setIsAttachFile] = useState(false);
  const [imagePath, setImagePath] = useState('');
  const [filePath, setFilePath] = useState('');
  const [dropdown, setDropDown] = useState(false);
  const [allSetting, setAllSetting] = useState();
  const [contactChatSetting, setContactChatSetting] = useState();
  useEffect(() => {
    getAllSettingData(setAllSetting);
    getContactSettingData(
      props.route.params.data.userid,
      setContactChatSetting,
    );
  });
  useEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .doc('' + props.route.params.id + props.route.params.data.userid)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    subscriber.onSnapshot(querysnapshot => {
      const allmessages = querysnapshot.docs.map(item => {
        return {...item._data, createdAt: item._data.createdAt};
      });
      setMessages(allmessages);
    });
  }, []);

  // ===================== gifted chat components ===========================
  const _pickDocument = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
        mode: 'import',
        allowMultiSelection: true,
      });
      const fileUri = result[0].fileCopyUri;
      if (!fileUri) {
        console.log('File URI is undefined or null');
        return;
      }
      if (fileUri.indexOf('.png') !== -1 || fileUri.indexOf('.jpg') !== -1) {
        setImagePath(fileUri);
        setIsAttachImage(true);
      } else {
        setFilePath(fileUri);
        setIsAttachFile(true);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled file picker');
      } else {
        console.log('DocumentPicker err => ', err);
        throw err;
      }
    }
  };
  const onSend = useCallback(
    async (messages = []) => {
      const msg = messages[0];
      let mymsg = {};
      console.log(msg, mymsg);
      console.log(imagePath);
      if (isAttachImage) {
        const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
        const reference = storage().ref(`media/${fileName}`);
        await reference.putFile(imagePath);
        const downloadURL = await reference.getDownloadURL();
        mymsg = {
          ...msg,
          sendTo: props.route.params.data.userid,
          sendBy: props.route.params.id,
          createdAt: Date.parse(msg.createdAt),
          image: downloadURL,
        };
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, mymsg),
        );
        firestore()
          .collection('chats')
          .doc('' + props.route.params.data.userid + props.route.params.id)
          .collection('media')
          .add({
            _id: mymsg.messageId,
            image: mymsg.downloadURL,
            createdAt: mymsg.Date.parse(new Date()),
            sendBy: props.route.params.id,
          });
        firestore()
          .collection('chats')
          .doc('' + props.route.params.id + props.route.params.data.userid)
          .collection('media')
          .add({
            _id: mymsg.messageId,
            image: mymsg.downloadURL,
            createdAt: mymsg.Date.parse(new Date()),
            sendBy: props.route.params.id,
          });

        setImagePath('');
        setIsAttachImage(false);
      } else if (isAttachFile) {
        mymsg = {
          ...msg,
          sendBy: props.route.params.id,
          sendTo: props.route.params.data.userid,
          createdAt: Date.parse(msg.createdAt),
          file: {
            url: filePath,
          },
        };
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, mymsg),
        );
        setFilePath('');
        setIsAttachFile(false);
      } else {
        mymsg = {
          ...msg,
          sendBy: props.route.params.id,
          sendTo: props.route.params.data.userid,
          createdAt: Date.parse(msg.createdAt),
        };
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, mymsg),
        );
      }
      firestore()
        .collection('chats')
        .doc('' + props.route.params.id + props.route.params.data.userid)
        .collection('messages')
        .add(mymsg);
      firestore()
        .collection('chats')
        .doc('' + props.route.params.data.userid + props.route.params.id)
        .collection('messages')
        .add(mymsg);
    },
    [filePath, imagePath, isAttachFile, isAttachImage],
  );
  const renderChatFooter = useCallback(() => {
    if (imagePath) {
      return (
        <View style={styles.chatFooter}>
          <Image source={{uri: imagePath}} style={{height: 100, width: 100}} />
          <TouchableOpacity
            onPress={() => setImagePath('')}
            style={styles.buttonFooterChatImg}>
            <Ionicons name="close" size={20} />
          </TouchableOpacity>
        </View>
      );
    }
    if (filePath) {
      return (
        <View style={styles.chatFooter}>
          <InChatFileTransfer filePath={filePath} />
          <TouchableOpacity
            onPress={() => setFilePath('')}
            style={styles.buttonFooterChat}>
            <Ionicons name="close" size={20} />
            {/* <Text style={styles.textFooterChat}>X</Text> */}
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }, [filePath, imagePath]);
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
    if (currentMessage.file && currentMessage.file.url) {
      return (
        <TouchableOpacity
          style={{
            ...styles.fileContainer,
            backgroundColor:
              props.currentMessage.user._id === 2 ? '#2e64e5' : '#efefef',
            borderBottomLeftRadius:
              props.currentMessage.user._id === 2 ? 15 : 5,
            borderBottomRightRadius:
              props.currentMessage.user._id === 2 ? 5 : 15,
          }}>
          <InChatFileTransfer
            style={{marginTop: -10}}
            filePath={currentMessage.file.url}
          />
          <View style={{flexDirection: 'column'}}>
            <Text
              style={{
                ...styles.fileText,
                color: currentMessage.user._id === 2 ? 'white' : 'black',
              }}>
              {currentMessage.text}
            </Text>
          </View>
        </TouchableOpacity>
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
          // position:'relative',
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
        <Composer {...props} textInputStyle={{bottom: 0}} />
        <TouchableOpacity
          style={{
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            paddingBottom: 12,
          }}
          onPress={_pickDocument}>
          <FontAwesome
            name="paperclip"
            size={25}
            color={'black'}
            style={{
              // marginBottom: 10,
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
          height: 60,
          justifyContent: 'flex-end',
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
      {/*  onLayout={initialLayout}> */}
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
                fontSize: 24,
              }}>
              {props.route.params.data.name}
            </Text>
          </Pressable>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Pressable
            onPress={() =>
              props.navigation.navigate('Call', {
                userid: props.route.params.id,
                call: 'voice call',
              })
            }>
            <FontAwesome
              name="phone"
              color={'white'}
              size={20}
              // style={{marginHorizontal: 10}}
            />
          </Pressable>
          <Pressable
            onPress={() =>
              props.navigation.navigate('Call', {
                userid: props.route.params.id,
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
            _id: props.route.params.id,
          }}
          renderBubble={renderBubble}
          alwaysShowSend
          scrollToBottom
          renderSend={renderSend}
          alignTop={true}
          isLoadingEarlier={true}
          scrollToBottomComponent={scrollToBottomComponent}
          renderChatFooter={renderChatFooter}
          renderInputToolbar={renderInputToolbar}
          renderComposer={renderComposer}
          renderAvatar={null}
          renderLoading={renderLoading}
          // bottomOffset={60}
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
