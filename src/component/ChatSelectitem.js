import {Pressable, Text, TextInput, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome1 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImageView from 'react-native-image-viewing';
import {Composer} from 'react-native-gifted-chat/lib/Composer';
import {InputToolbar, Send} from 'react-native-gifted-chat';
import {useState} from 'react';
import {Formik} from 'formik';

const SendImages = props => {
  //   console.log(props?.route?.params?.data);
  const [message, setMessages] = useState({});
  const headerComponent = () => {
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
  const footerComponent = () => {
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
            console.log(values.text);
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
                  renderComposer={() => renderComposer({handleChange, values})}
                  // renderSend={()=>renderSend({handleSubmit,values})}
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
  const renderComposer = ({handleChange, values}) => {
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
          <Text>Dark</Text>
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
            height: 100,
            width: '100%',
            alignContent: 'center',
            justifyContent: 'center',
          },
        ]}>
        <ImageView
          HeaderComponent={headerComponent}
          FooterComponent={footerComponent}
          images={props?.route?.params?.data}
          presentationStyle={'overFullScreen'}
          imageIndex={props?.route?.params?.imageIndex}
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
