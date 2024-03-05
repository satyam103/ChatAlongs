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
import Header from './Header';
import {ScrollView} from 'react-native-gesture-handler';
import {Image} from 'react-native';

let userid = '';
const headerComponent = ({navigation, imageindex, fileName = ''}) => {
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
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={'white'} />
        </TouchableOpacity>
        <View>
          <Text style={{fontSize: 18, color: 'white'}}>{fileName}</Text>
        </View>
      </View>
    </View>
  );
};

const SendImages = props => {
  useEffect(() => {
    const getUserid = async () => {
      userid = await AsyncStorage.getItem('userid');
    };
    getUserid();
  });
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
    props.navigation.navigate('Chats', {
      data: props.route.params.userdata,
      id: userid,
    });
  };
  const FooterComponent = imageIndex => {
    return (
      <View
        style={{
          height: 80,
          backgroundColor: 'rgba(0,0,0,0)',
          width: '100%',
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
          <Text style={{color: 'white'}}>
            {props?.route?.params?.userdata?.name}
          </Text>
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
          HeaderComponent={() =>
            headerComponent({
              navigation: props.navigation,
              imageIndex: props?.route?.params?.data?.imageIndex,
            })
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
  const [message, setMessages] = useState([]);
  const setImageMessage = ({index, text}) => {
    setMessages(prev => {
      console.log(prev, 'sgsrgrg', message[index]);
      prev[index] = {text: text};
      return [...prev];
    });
    console.log(index, 'dfgdfgdf', text, 'sgsrgrg', message[index]);
  };
  useEffect(() => {
    const getUserid = async () => {
      userid = await AsyncStorage.getItem('userid');
    };
    getUserid();
  });
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
  const sendValues = props => {
    console.log(props, message);
  };
  const FooterComponent = ({
    handleChange,
    handleSubmit,
    values,
    imageIndex,
  }) => {
    return (
      <View
        style={{
          height: 80,
          backgroundColor: 'rgba(0,0,0,0)',
          width: '100%',
        }}>
        {/* <Formik
          initialValues={{
            text: message[imageIndex]?.text ? message[imageIndex]?.text : '',
          }}
          onSubmit={(values, action) => {
            // onSend({text: values.text});
            sendValues(values);
          }}>
          {({handleChange, handleSubmit, values}) => (
            <> */}
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
                imageIndex={imageIndex}
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
        {/* </>
          )}
        </Formik> */}
      </View>
    );
  };
  const RenderComposer = ({handleChange, imageIndex, values}) => {
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
          <Text style={{color: 'white'}}>
            {props?.route?.params?.userdata?.name}
          </Text>
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
        <Formik
          initialValues={{
            text: message[currIndex]?.text ? message[currIndex]?.text : '',
          }}
          onSubmit={(values, action) => {
            // onSend({text: values.text});
            sendValues(values);
          }}>
          {({handleChange, handleSubmit, values}) => (
            <>
              <ImageView
                HeaderComponent={item =>
                  headerComponent({
                    navigation: props.navigation,
                    imageIndex: item.imageIndex,
                    fileName: props?.route?.params?.data[item.imageIndex]?.name,
                  })
                }
                FooterComponent={item => (
                  <FooterComponent
                    imageIndex={item.imageIndex}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    values={values}
                  />
                )}
                images={props?.route?.params?.data}
                keyExtractor={item => item.imageIndex}
                imageIndex={0}
                onImageIndexChange={item => {
                  setCurrIndex(item);
                  setImageMessage({index: item-1, text: values.text});
                  values.text = message[currIndex]?.text
                    ? message[currIndex]?.text
                    : '';
                  return item;
                }}
                presentationStyle={'overFullScreen'}
                swipeToCloseEnabled={false}
                visible={true}
                onRequestClose={() => {
                  props.navigation.goBack();
                }}
              />
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

const SendContact = props => {
  useEffect(() => {
    const getUserid = async () => {
      userid = await AsyncStorage.getItem('userid');
    };
    getUserid();
  });
  const onSend = data => {
    let mymsg = {};
    data.forEach(async element => {
      let date = new Date();
      let id = uuid.v4();
      try {
        mymsg = {
          _id: id,
          contactDetail: element,
          createdAt: Date.parse(date),
          sendBy: userid,
          sendTo: props?.route?.params?.userdata?.userid,
          user: {
            _id: userid,
          },
        };
        firestore()
          .collection('chats')
          .doc('' + userid + props?.route?.params?.userdata?.userid)
          .collection('messages')
          .add(mymsg);
        firestore()
          .collection('chats')
          .doc('' + props?.route?.params?.userdata?.userid + userid)
          .collection('messages')
          .add(mymsg);
        firestore()
          .collection('chats')
          .doc('' + userid + props?.route?.params?.userdata?.userid)
          .collection('contact')
          .add(mymsg);
        firestore()
          .collection('chats')
          .doc('' + props.route?.params?.userdata?.userid + userid)
          .collection('contact')
          .add(mymsg);
        props.navigation.navigate('Chats', {
          data: props?.route?.params?.userdata,
          id: userid,
        });
      } catch (error) {
        console.log(error, '=========sending contact');
      }
    });
  };

  return (
    <View>
      <Header title={'Select Contact'} />
      <Formik
        initialValues={{data: [...props?.route?.params?.data]}}
        onSubmit={(values, action) => {
          onSend(values.data);
        }}>
        {({handleSubmit, handleChange, values}) => (
          <>
            <ScrollView
              style={{
                height: '90%',
                padding: 5,
              }}>
              {values.data.map((item, index) => {
                return (
                  <View
                    style={{
                      marginBottom: 5,
                      elevation: 5,
                      backgroundColor: 'rgb(255,255,255)',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        margin: 5,
                        paddingBottom: 10,
                        alignItems: 'center',
                        borderBottomWidth: 0.5,
                        borderBottomColor: 'rgba(0,0,0,0.5)',
                      }}>
                      <View>
                        <Image
                          source={require('../../assets/image/unknownprofile.jpg')}
                          style={{
                            height: 50,
                            width: 50,
                          }}
                        />
                      </View>
                      <View
                        style={{
                          marginLeft: 10,
                        }}>
                        <Text style={{color: 'black', fontSize: 18}}>
                          {item.name}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        marginBottom: 10,
                        marginLeft: 10,
                        marginRight: 10,
                      }}>
                      {item.number.map((number, idx) => {
                        return (
                          <View
                            style={{
                              margin: 5,
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Ionicons name="call" size={20} color={'green'} />
                              <View>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    marginLeft: 15,
                                  }}>
                                  {number}
                                </Text>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontSize: 14,
                                    marginLeft: 15,
                                  }}>
                                  Mobile
                                </Text>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
              <View
                style={{
                  height: 90,
                }}></View>
            </ScrollView>
            <Pressable
              onPress={() => handleSubmit()}
              style={{
                height: 55,
                width: 55,
                borderRadius: 20,
                backgroundColor: 'green',
                position: 'absolute',
                bottom: 15,
                right: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <FontAwesome name="send" size={25} color={'white'} />
            </Pressable>
          </>
        )}
      </Formik>
    </View>
  );
};

export {SendImages, SendDocs, SendContact};
