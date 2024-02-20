import {Formik} from 'formik';
import {View} from 'react-native';
import {InputToolbar} from 'react-native-gifted-chat';

const FooterComponent = imageIndex => {
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
                renderComposer={() => renderComposer({handleChange, values})}
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
