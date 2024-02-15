import React, {Component, useEffect, useState} from 'react';
import {
  ZegoUIKitPrebuiltCall,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  ONE_ON_ONE_VOICE_CALL_CONFIG,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import AgoraUIKit from 'agora-rn-uikit';
import {RtcEngine, AgoraView} from 'react-native-agora';
import {createAgoraRtcEngine} from 'react-native-agora';

export default function CallingPage(props) {
  const [callType, setCallType] = useState();
  const [appId, setAppId] = useState('7cf1e457ce2a47fe83842605b06ff771');
  const [channelName, setChannelName] = useState('test');
  const [videoCall, setVideoCall] = useState(true);
  const uid=''
  const agoraToken =
    '007eJxTYPhasGNvy4GkpL2e6tHztKq+OX2o9JtuP98hNdNo1+Ygfz0FBvPkNMNUE1Pz5FSjRBPztFQLYwsTIzMD0yQDs7Q0c3PDBe2nUxsCGRkeqgYzMzJAIIjPwlCSWlzCwAAAZcgfig==';
  const connectionData = {
    appId: appId,
    channel: channelName,
    token:
      '007eJxTYPhasGNvy4GkpL2e6tHztKq+OX2o9JtuP98hNdNo1+Ygfz0FBvPkNMNUE1Pz5FSjRBPztFQLYwsTIzMD0yQDs7Q0c3PDBe2nUxsCGRkeqgYzMzJAIIjPwlCSWlzCwAAAZcgfig==',
  };
  const callbacks = {
    EndCall: () => setVideoCall(false),
  };
  const engine = createAgoraRtcEngine();
  engine.initialize({appId: appId});
  useEffect(async() => {
    uid = await AsyncStorage.getItem('userid');

    // Initialize the Agora SDK
    const initAgora = async () => {
      const engine = await RtcEngine.create(appId);
      await engine.enableVideo();

      engine.addListener('UserJoined', uid => {
        console.log(`User ${uid} joined`);
      });

      engine.addListener('UserOffline', (uid, reason) => {
        console.log(`User ${uid} left, reason: ${reason}`);
      });

      await engine.joinChannel(agoraToken, channelName, null, 0);
    };

    initAgora();

    return () => {
      RtcEngine.destroy();
    };
  }, []);
  useEffect(() => {
    const getData = () => {
      setCallType(props?.route?.params?.call);
    };
    getData();
  }, []);
  function setupRTM() {
    self.agoraRTM = AgoraRtmKit({
      appId: '<#Agora App Id#>',
      delegate: self,
    });
    print('logging in as (UIDevice.current.name)');
    self.agoraRTM.login({
      byToken: nil,
      user: UIDevice.current.name,
      completion: self.rtmLoginCallback,
    });
  }

  if (callType === 'voice call') {
    return (
      <View style={{height: '100%', flex: 1}}>
        <ZegoUIKitPrebuiltCall
          appID={1566620547}
          appSign={
            'a26e53d5d51bc1d27a3d9e7d8220cbac27c8d95580114b9d8d37f491ae30a10e'
          }
          userID={props.route.params.username} // userID can be something like a phone number or the user id on your own user system.
          userName={props.route.params.username}
          callID={'callID'} // callID can be any unique string.
          config={{
            // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
            ...ONE_ON_ONE_VOICE_CALL_CONFIG,
            // topMenuBarConfig: {
            //   buttons: [ZegoMenuBarButtonName.minimizingButton],
            // },
            onOnlySelfInRoom: () => {
              props.navigation.goBack();
            },
            onHangUp: () => {
              props.navigation.goBack();
            },
            onWindowMinimized: () => {
              console.log('[Demo]CallPage onWindowMinimized');
              props.navigation.navigate('HomePage');
            },
            onWindowMaximized: () => {
              console.log('[Demo]CallPage onWindowMaximized');
              props.navigation.navigate('CallPage', {
                userID: props.route.params.username,
                userName: props.route.params.username,
                callID: 'callId',
              });
            },
          }}
        />
      </View>
    );
  } else if (callType === 'video call') {
    return (
      <View style={{height: '100%', flex: 1}}>
        <ZegoUIKitPrebuiltCall
          appID={1566620547}
          appSign={
            'a26e53d5d51bc1d27a3d9e7d8220cbac27c8d95580114b9d8d37f491ae30a10e'
          }
          userID={props.route.params.userid} // userID can be something like a phone number or the user id on your own user system.
          userName={'Me'}
          callID={'callID'} // callID can be any unique string.
          config={{
            // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
            ...ONE_ON_ONE_VIDEO_CALL_CONFIG,
            onOnlySelfInRoom: () => {
              props.navigation.goBack();
            },
            onHangUp: () => {
              props.navigation.goBack();
            },
          }}
        />
      </View>
    );
  } else if (callType === 'group video call') {
    return (
      <View style={{height: '100%', flex: 1}}>
        <ZegoUIKitPrebuiltCall
          appID={1566620547}
          appSign={
            'a26e53d5d51bc1d27a3d9e7d8220cbac27c8d95580114b9d8d37f491ae30a10e'
          }
          userID={props.route.params.username} // userID can be something like a phone number or the user id on your own user system.
          userName={props.route.params.username}
          callID={'callID'} // callID can be any unique string.
          config={{
            // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
            ...GROUP_VIDEO_CALL_CONFIG,
            onOnlySelfInRoom: () => {
              props.navigation.goBack();
            },
            onHangUp: () => {
              props.navigation.goBack();
            },
          }}
        />
      </View>
    );
  } else if (callType === 'group voice call') {
    return (
      <View style={{height: '100%', flex: 1}}>
        <ZegoUIKitPrebuiltCall
          appID={1566620547}
          appSign={
            'a26e53d5d51bc1d27a3d9e7d8220cbac27c8d95580114b9d8d37f491ae30a10e'
          }
          userID={props.route.params.username} // userID can be something like a phone number or the user id on your own user system.
          userName={props.route.params.username}
          callID={'callID'} // callID can be any unique string.
          config={{
            // You can also use ONE_ON_ONE_VOICE_CALL_CONFIG/GROUP_VIDEO_CALL_CONFIG/GROUP_VOICE_CALL_CONFIG to make more types of calls.
            ...GROUP_VOICE_CALL_CONFIG,
            onOnlySelfInRoom: () => {
              props.navigation.goBack();
            },
            onHangUp: () => {
              props.navigation.goBack();
            },
          }}
        />
      </View>
    );
  } else if (callType === 'agora') {
    return (
      <View
        style={{
          flex: 1,
        }}>
        <AgoraUIKit style={{flex:1}} connectionData={connectionData} rtcCallbacks={callbacks} />
      </View>
    );
  }
}
