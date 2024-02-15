import React, {useState} from 'react';
import {ActivityIndicator, ImageBackground, Pressable, Text, View} from 'react-native';
import LoginModal from '../component/LoginModal';


const Login = props => {
  const [showModal, setShowModal] = useState(false);
  return (
    <View style={[{height: '100%', width: '100%'}]}>
      <ImageBackground
        source={require('../../assets/image/display.jpg')}
        resizeMode="cover"
        style={[showModal && {opacity: 0.5}, {flex: 1}]}>
        <View style={{height: '80%'}}></View>
        <View
          style={{
            height: '20%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Pressable
            style={{
              height: 50,
              width: '80%',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgb(30,50,250)',
              borderRadius: 100,
            }}
            onPress={() => setShowModal(true)}>
            <Text style={{color: 'white', fontSize: 20}}>
              Getting started...
            </Text>
          </Pressable>
          {/* <ActivityIndicator size={'large'}/> */}
        </View>
        {showModal && (
          <LoginModal
            modal={showModal}
            onModalClose={setShowModal}
            onlogin={() => props.navigation.navigate('Home')}
          />
        )}
      </ImageBackground>
    </View>
  );
};

export default Login;
