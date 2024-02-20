import {useEffect, useState} from 'react';
import {
  FlatList,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome1 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageView from 'react-native-image-viewing';
import {Composer} from 'react-native-gifted-chat/lib/Composer';
import {InputToolbar, Send} from 'react-native-gifted-chat';
import {Formik} from 'formik';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

let userid = '';
const SendImages = props => {
  console.log(props?.route?.params, 'params');
  const [message, setMessages] = useState();
  const [currIndex, setCurrIndex] = useState(0);
  useEffect(() => {
    const getUserid = async () => {
      userid = await AsyncStorage.getItem('userid');
      // setMessages(props?.route?.params?.data)
    };
    getUserid();
  });
  // console.log(message)
  // {"_id": "3de61355-4454-4894-b83e-2c860ea5a25d", "createdAt": 2024-02-19T09:52:30.586Z, "text": "Dfgb", "user": {"_id": "cfd991af-8684-4aeb-9052-13060d7fd990"}}
  // {"_id": "b6c0ff39-1b85-405f-9d1b-51946406bb4b", "createdAt": 1708336423000, "sendBy": "cfd991af-8684-4aeb-9052-13060d7fd990", "sendTo": "fe94ef86-675c-4401-9c78-0b305b0201fb", "text": "ddfx", "user": {"_id": "cfd991af-8684-4aeb-9052-13060d7fd990"}}
  // {"_id": "9c21ccfc-b3f6-46a0-8c8a-af7d56f87e6b", "createdAt": 1708338162000, "sendBy": "cfd991af-8684-4aeb-9052-13060d7fd990", "sendTo": "fe94ef86-675c-4401-9c78-0b305b0201fb", "text": "Adc", "user": {"_id": "cfd991af-8684-4aeb-9052-13060d7fd990"}}
  const onSend = ({text}) => {
    let mymsg = {};
    let date = new Date();
    let id = uuid.v4();
    mymsg = {
      _id: id,
      text: text,
      createdAt: Date.parse(date),
      sendBy: userid,
      sendTo: props?.route?.params?.userdata.id,
      user: {
        _id: userid,
      },
    };
    console.log(mymsg);
  };
  const headerComponent = imadeIndex => {
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
                  renderComposer={() => <RenderComposer handleChange={handleChange} values={values} />}
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
          paddingHorizontal: 15,
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
          <Text>{props?.route?.params?.userdata.name}</Text>
        </View>
        <Send
          {...props}
          text={values.text}
          onSend={handleSubmit}
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
        </Send>
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
          FooterComponent={() =>
            <FooterComponent imageIndex={props?.route?.params?.data?.imageIndex} />
          }
          images={props?.route?.params?.data}
          presentationStyle={'overFullScreen'}
          imageIndex={currIndex}
          onImageIndexChange={index => setCurrIndex(index)}
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

export {SendImages};
