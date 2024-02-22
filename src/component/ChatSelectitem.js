import {useEffect, useState} from 'react';
import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome1 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageView from 'react-native-image-viewing';
import {Composer} from 'react-native-gifted-chat/lib/Composer';
import {InputToolbar} from 'react-native-gifted-chat';
import {Formik} from 'formik';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

let userid = '';
const SendImages = props => {
  useEffect(() => {
    const getUserid = async () => {
      userid = await AsyncStorage.getItem('userid');
    };
    getUserid();
  });
  // console.log(props?.route?.params);
  const onSend = ({text = ''}) => {
    let mymsg = {};
    props?.route?.params?.data.forEach(async element => {
      let date = new Date();
      let id = uuid.v4();
      const fileName = element.uri.substring(element.uri.lastIndexOf('/') + 1);
      const reference = storage().ref(`Chat/${fileName}`);
      try {
        await reference.putFile(element.uri);
        const downloadURL = await reference.getDownloadURL();
        mymsg = {
          _id: id,
          createdAt: Date.parse(date),
          sendBy: userid,
          sendTo: props?.route?.params?.userdata.userid,
          user: {
            _id: userid,
          },
          image: downloadURL,
        };
        firestore()
          .collection('chats')
          .doc('' + userid + props.route.params.userdata.userid)
          .collection('messages')
          .add(mymsg);
        firestore()
          .collection('chats')
          .doc('' + props.route.params.userdata.userid + userid)
          .collection('messages')
          .add(mymsg);
        firestore()
          .collection('chats')
          .doc('' + userid + props.route.params.userdata.userid)
          .collection('media')
          .add(mymsg);
        firestore()
          .collection('chats')
          .doc('' + props.route.params.userdata.userid + userid)
          .collection('media')
          .add(mymsg);
      } catch (error) {
        console.log('error while sending media======', error);
      }
    });
    if (text !== '' && text !== null && text !== undefined) {
      let id = uuid.v4();
      let date = new Date();
      mymsg = {
        _id: id,
        text: text,
        createdAt: Date.parse(date),
        sendBy: userid,
        sendTo: props?.route?.params?.userdata.userid,
        user: {
          _id: userid,
        },
      };
      firestore()
        .collection('chats')
        .doc('' + userid + props.route.params.userdata.userid)
        .collection('messages')
        .add(mymsg);
      firestore()
        .collection('chats')
        .doc('' + props.route.params.userdata.userid + userid)
        .collection('messages')
        .add(mymsg);
    }
    console.log(mymsg);
    props.navigation.navigate('Chats', {
      data: props.route.params.userdata,
      id: userid,
    });
  };
  const headerComponent = imageIndex => {
    return (
      <View
        style={{
          height: 60,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              height: 50,
              width: 50,
              borderRadius: 50,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 5,
            }}
            onPress={() => props.navigation.goBack()}>
            <Ionicons name="close" size={20} color={'white'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const FooterComponent = imageIndex => {
    return (
      <View
        style={{
          height: 80,
          backgroundColor: 'rgba(0,0,0,0)',
          width: '100%',
          //   justifyContent: 'center',
        }}>
        <Formik
          initialValues={{text: ''}}
          onSubmit={(values, action) => {
            onSend({text: values.text});
          }}>
          {({handleChange, handleSubmit, values}) => (
            <>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,1)',
                  borderRadius: 30,
                  marginLeft: 10,
                  marginRight: 10,
                }}>
                <InputToolbar
                  {...props}
                  renderComposer={() => (
                    <RenderComposer
                      handleChange={handleChange}
                      values={values}
                    />
                  )}
                  containerStyle={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    width: '100%',
                    paddingHorizontal: 10,
                  }}
                />
              </View>
              <RenderSend handleSubmit={handleSubmit} values={values} />
            </>
          )}
        </Formik>
      </View>
    );
  };
  const RenderComposer = ({handleChange, values}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(0,0,0,1)',
          borderRadius: 30,
          paddingHorizontal: 10,
          alignItems: 'flex-end',
        }}>
        <Pressable
          style={{
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            paddingBottom: 12,
          }}>
          <FontAwesome1 name="grin" size={22} color={'white'} />
        </Pressable>
        <Composer
          {...props}
          text={values.text}
          onTextChanged={handleChange('text')}
          textInputStyle={{bottom: 0}}
        />
      </View>
    );
  };
  const RenderSend = ({handleSubmit, values}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          top: 5,
          height: '100%',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}>
        <View
          style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            backgroundColor: 'black',
            borderRadius: 20,
            marginHorizontal: 5,
          }}>
          <Text>{props?.route?.params?.userdata?.name}</Text>
        </View>
        <Pressable
          text={values.text}
          onPress={() => handleSubmit()}
          alwaysShowSend={true}
          containerStyle={{height: 44, justifyContent: 'center'}}>
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
        </Pressable>
      </View>
    );
  };
  return (
    <View>
      <View
        style={[
          {
            // flex:1,
            height: 100,
            width: '100%',
            alignContent: 'center',
            justifyContent: 'center',
          },
        ]}>
        <ImageView
          HeaderComponent={() =>
            headerComponent(props?.route?.params?.data?.imageIndex)
          }
          FooterComponent={() => (
            <FooterComponent
              imageIndex={props?.route?.params?.data?.imageIndex}
            />
          )}
          images={props?.route?.params?.data}
          presentationStyle={'overFullScreen'}
          swipeToCloseEnabled={false}
          visible={true}
          onRequestClose={() => {
            props.navigation.goBack();
          }}
        />
      </View>
    </View>
  );
};

const SendDocs = props => {
  const [currIndex, setCurrIndex] = useState(0);
  useEffect(() => {
    const getUserid = async () => {
      userid = await AsyncStorage.getItem('userid');
    };
    getUserid();
  });
  console.log(props?.route?.params);
  const onSend = ({text = ''}) => {
    let mymsg = {};
    props?.route?.params?.data.forEach(async element => {
      let date = new Date();
      let id = uuid.v4();
      const fileName = element.fileUri.substring(
        element.fileUri.lastIndexOf('/') + 1,
      );
      const reference = storage().ref(`ChatDocs/${fileName}`);
      try {
        await reference.putFile(element.fileUri);
        const downloadURL = await reference.getDownloadURL();
        mymsg = {
          _id: id,
          createdAt: Date.parse(date),
          sendBy: userid,
          sendTo: props?.route?.params?.userdata.userid,
          user: {
            _id: userid,
          },
          fileUri: downloadURL,
          fileName: element.name,
          fileType: element.type,
          fileSize: element.size,
          fileImage: element.uri,
        };
        firestore()
          .collection('chats')
          .doc('' + userid + props.route.params.userdata.userid)
          .collection('messages')
          .add(mymsg);
        firestore()
          .collection('chats')
          .doc('' + props.route.params.userdata.userid + userid)
          .collection('messages')
          .add(mymsg);
        firestore()
          .collection('chats')
          .doc('' + userid + props.route.params.userdata.userid)
          .collection('docs')
          .add(mymsg);
        firestore()
          .collection('chats')
          .doc('' + props.route.params.userdata.userid + userid)
          .collection('docs')
          .add(mymsg);
      } catch (error) {
        console.log('error while sending docs======', error);
      }
    });
    if (text !== '' && text !== null && text !== undefined) {
      let id = uuid.v4();
      let date = new Date();
      mymsg = {
        _id: id,
        text: text,
        createdAt: Date.parse(date),
        sendBy: userid,
        sendTo: props?.route?.params?.userdata.userid,
        user: {
          _id: userid,
        },
      };
      firestore()
        .collection('chats')
        .doc('' + userid + props.route.params.userdata.userid)
        .collection('messages')
        .add(mymsg);
      firestore()
        .collection('chats')
        .doc('' + props.route.params.userdata.userid + userid)
        .collection('messages')
        .add(mymsg);
    }
    props.navigation.navigate('Chats', {
      data: props.route.params.userdata,
      id: userid,
    });
  };
  const headerComponent = imageIndex => {
    return (
      <View
        style={{
          height: 60,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{
              height: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              height: 50,
              width: 50,
              borderRadius: 50,
              backgroundColor: 'rgba(0,0,0,0.6)',
              justifyContent: 'center',
              alignItems: 'center',
              margin: 5,
            }}
            onPress={() => props.navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={'white'} />
          </TouchableOpacity>
          <View>
            <Text style={{fontSize:18,color:'white'}}>{props?.route?.params?.data[imageIndex]?.name}</Text>
          </View>
        </View>
      </View>
    );
  };
  const FooterComponent = imageIndex => {
    return (
      <View
        style={{
          height: 80,
          backgroundColor: 'rgba(0,0,0,0)',
          width: '100%',
          //   justifyContent: 'center',
        }}>
        <Formik
          initialValues={{text: ''}}
          onSubmit={(values, action) => {
            onSend({text: values.text});
          }}>
          {({handleChange, handleSubmit, values}) => (
            <>
              <View
                style={{
                  backgroundColor: 'rgba(0,0,0,1)',
                  borderRadius: 30,
                  marginLeft: 10,
                  marginRight: 10,
                }}>
                <InputToolbar
                  {...props}
                  renderComposer={() => (
                    <RenderComposer
                      handleChange={handleChange}
                      values={values}
                    />
                  )}
                  containerStyle={{
                    backgroundColor: 'rgba(0,0,0,0)',
                    borderTopWidth: 0,
                    width: '100%',
                    paddingHorizontal: 10,
                  }}
                />
              </View>
              <RenderSend handleSubmit={handleSubmit} values={values} />
            </>
          )}
        </Formik>
      </View>
    );
  };
  const RenderComposer = ({handleChange, values}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(0,0,0,1)',
          borderRadius: 30,
          paddingHorizontal: 10,
          alignItems: 'flex-end',
        }}>
        <Pressable
          style={{
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            paddingBottom: 12,
          }}>
          <FontAwesome1 name="grin" size={22} color={'white'} />
        </Pressable>
        <Composer
          {...props}
          text={values.text}
          onTextChanged={handleChange('text')}
          textInputStyle={{bottom: 0}}
        />
      </View>
    );
  };
  const RenderSend = ({handleSubmit, values}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          top: 5,
          height: '100%',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}>
        <View
          style={{
            paddingVertical: 5,
            paddingHorizontal: 10,
            backgroundColor: 'black',
            borderRadius: 20,
            marginHorizontal: 5,
          }}>
          <Text>{props?.route?.params?.userdata?.name}</Text>
        </View>
        <Pressable
          text={values.text}
          onPress={() => handleSubmit()}
          alwaysShowSend={true}
          containerStyle={{height: 44, justifyContent: 'center'}}>
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
        </Pressable>
      </View>
    );
  };
  return (
    <View>
      <View
        style={[
          {
            height: 100,
            width: '100%',
            alignContent: 'center',
            justifyContent: 'center',
          },
        ]}>
        <ImageView
          HeaderComponent={item => headerComponent(item.imageIndex)}
          FooterComponent={() => <FooterComponent imageIndex={currIndex} />}
          images={props?.route?.params?.data}
          keyExtractor={item => item.imageIndex}
          imageIndex={currIndex}
          onImageIndexChange={item => setCurrIndex(item)}
          presentationStyle={'overFullScreen'}
          swipeToCloseEnabled={false}
          visible={true}
          onRequestClose={() => {
            props.navigation.goBack();
          }}
        />
      </View>
    </View>
  );
};

export {SendImages, SendDocs};
