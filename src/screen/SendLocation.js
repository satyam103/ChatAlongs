import Geolocation from '@react-native-community/geolocation';
import React, {useEffect, useState} from 'react';
import {Pressable, Share, Text} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {SafeAreaView, View} from 'react-native';
import MapView from 'react-native-maps';
import {PERMISSIONS, RESULTS, check} from 'react-native-permissions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import {useTheme} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GiftedChat} from 'react-native-gifted-chat';
// import RNLocation from 'react-native-location';

let userid = '';
const SendLocation = props => {
  console.log(props.route.params);
  const [userLatitude, setUserLatitude] = useState(null);
  const [userLongitude, setUserLongitude] = useState(null);
  const [mapSnapshot, setMapshot] = useState();
  const {colors} = useTheme();
  useEffect(() => {
    getCurrentLocation();
    const getUserid = async () => {
      userid = await AsyncStorage.getItem('userid');
    };
    getUserid();
  });
  // ======================= get location ============================
  const getCurrentLocation = () => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
      if (result === RESULTS.GRANTED) {
        Geolocation.getCurrentPosition(
          position => {
            let initialPosition = position;
            if (position) {
              setUserLatitude(initialPosition?.coords?.latitude);
              setUserLongitude(initialPosition?.coords?.longitude);
            }
            // console.log(position);
          },
          error => console.log('Error', JSON.stringify(error)),
          {enableHighAccuracy: false, timeout: 20000},
        );
      } else {
        requestAccessLocationPermission();
        console.log('Location permission is not enabled');
      }
    });
  };
  const requestAccessLocationPermission = () => {
    Geolocation.requestAuthorization(() => {
      getCurrentLocation();
    });
    if (Platform.OS == 'ios') {
      check(PERMISSIONS.IOS.LOCATION_ALWAYS).then(result => {
        if (result === RESULTS.GRANTED) {
          getCurrentLocation();
        }
      });
    } else {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION).then(result => {
        if (result === RESULTS.GRANTED) {
          getCurrentLocation();
        }
      });
    }
  };
  const oncurrentlocationShare = () => {
    let mymsg = {};
    let date = new Date();
    let id = uuid.v4();
    mymsg = {
      _id: id,
      createdAt: Date.parse(date),
      location: {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      sendBy: userid,
      sendTo: props?.route?.params?.userdata?.userid,
      user: {
        _id: userid,
      },
    };
    props?.route?.params?.setMessages(previousMessages =>
      GiftedChat.append(previousMessages, mymsg),
    );
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
    props.navigation.navigate('Chats', {
      data: props?.route?.params?.userdata,
      id: userid,
    });
  };

  // const fetchLocation = () => {
  //   const unsubscribe = RNLocation.subscribeToLocationUpdates(([locations]) => {
  //     const locationPayload = {
  //       latitude: locations.latitude,
  //       longitude: locations.longitude,
  //       accuracy: locations.accuracy,
  //     };
  //     dispatch(emitLocation(locationPayload));
  //     unsubscribe();
  //   });
  // };

  // const initLocationService = () => {
  //   RNLocation.requestPermission({
  //     ios: 'whenInUse',
  //     android: {
  //       detail: 'fine',
  //     },
  //   }).then(granted => {
  //     if (granted) fetchLocation();
  //   });
  // };

  return (
    <SafeAreaView>
      <View style={{flex: 1}}>
        <View
          style={{
            height: 50,
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                height: '100%',
              }}
              onPress={() => props.navigation.goBack()}>
              <Ionicons name="arrow-back" size={20} color={'white'} />
            </TouchableOpacity>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                marginLeft: 10,
                fontWeight: 'bold',
              }}>
              Send Location
            </Text>
          </View>
        </View>
        <View
          style={{
            height: Platform.OS == 'ios' ? '100%' : 300,
            width: '100%',
          }}>
          <MapView
            style={{flex: 1, alignItems: 'center'}}
            showsUserLocation={true}
            showsMyLocationButton={true}
            customMapStyle={mapStyle}
            showsCompass={true}
            rotateEnabled={false}
            region={{
              latitude: userLatitude && userLatitude,
              longitude: userLongitude && userLongitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}></MapView>
        </View>
        <View>
          <Pressable
            style={{
              borderBottomWidth: 0.5,
              borderBottomColor: 'rgb(200,200,200)',
              height: 70,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 5,
            }}>
            <View
              style={{
                height: 50,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#0D9276',
                marginHorizontal: 10,
                borderRadius: 50,
              }}>
              <FontAwesome6 name="location-dot" size={24} color={'white'} />
            </View>
            <View style={{marginLeft: 5}}>
              <Text
                style={{color: colors.text, fontSize: 16, fontWeight: 'bold'}}>
                Share Live Location
              </Text>
              <Text style={{color: colors.text, fontSize: 14}}>for 1hr</Text>
            </View>
          </Pressable>
          <Pressable
            onPress={() => {
              getCurrentLocation();
              oncurrentlocationShare();
            }}
            style={{
              height: 70,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 5,
            }}>
            <View
              style={{
                height: 50,
                width: 50,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#0D9276',
                marginHorizontal: 10,
                borderRadius: 50,
              }}>
              <FontAwesome6
                name="location-crosshairs"
                size={24}
                color={'white'}
              />
            </View>
            <View style={{marginLeft: 5}}>
              <Text
                style={{color: colors.text, fontSize: 16, fontWeight: 'bold'}}>
                Share current location
              </Text>
            </View>
          </Pressable>
          {/* <TouchableOpacity onPress={takeSnapshot}>
            <Text style={{color: 'black'}}>shoot</Text>
          </TouchableOpacity> */}
        </View>
        {/* <Image source={{uri: mapSnapshot?.uri}} /> */}
      </View>
    </SafeAreaView>
  );
};

const mapStyle = [
  {
    featureType: 'administrative',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#d6e2e6',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#cfd4d5',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#7492a8',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.fill',
    stylers: [
      {
        lightness: 25,
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#dde2e3',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#cfd4d5',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#dde2e3',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#7492a8',
      },
    ],
  },
  {
    featureType: 'landscape.natural.terrain',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#dde2e3',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.icon',
    stylers: [
      {
        saturation: -100,
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#588ca4',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#a9de83',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#bae6a1',
      },
    ],
  },
  {
    featureType: 'poi.sports_complex',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#c6e8b3',
      },
    ],
  },
  {
    featureType: 'poi.sports_complex',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#bae6a1',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        saturation: -45,
      },
      {
        lightness: 10,
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#41626b',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#c1d1d6',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#a6b5bb',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'road.highway.controlled_access',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#9fb6bd',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'labels.icon',
    stylers: [
      {
        saturation: -70,
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#b4cbd4',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#588ca4',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#008cb5',
      },
    ],
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'geometry.fill',
    stylers: [
      {
        saturation: -100,
      },
      {
        lightness: -5,
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#a6cbe3',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];

export default SendLocation;
