import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Time} from 'react-native-gifted-chat';
import {TouchableOpacity} from 'react-native';
import {addContact, openContactForm} from 'react-native-contacts';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {color} from 'react-native-reanimated';
// import {useTheme} from '@react-navigation/native';
import Color from 'react-native-gifted-chat/lib/Color';
import MapView, {Marker} from 'react-native-maps';
import openMap from 'react-native-open-maps';

const InChatFileTransfer = ({currentMessage, userdata}) => {
  const filePath = currentMessage?.fileName;
  var fileType = '';
  var name = '';
  if (filePath !== undefined) {
    name = filePath.split('/').pop();
    fileType = filePath.split('.').pop();
  }
  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <View style={{flexDirection: 'row', width: '83%'}}>
          <Image
            source={
              fileType === 'pdf'
                ? require('../../assets/image/pdf.png')
                : require('../../assets/image/unknown.png')
            }
            style={{height: 40, width: 40, margin: 3}}
          />
          <View
            style={[currentMessage.user._id !== userdata && {maxWidth: '75%'}]}>
            <Text
              lineBreakMode="clip"
              numberOfLines={1}
              style={[
                styles.text,
                currentMessage.user._id !== userdata && {
                  color: Color.defaultBlue,
                },
              ]}>
              {name.replace('%20', '').replace(' ', '')}
            </Text>
            <Text
              style={[
                styles.textType,
                currentMessage.user._id !== userdata && {
                  color: Color.defaultBlue,
                },
              ]}>
              {fileType.toUpperCase()}
            </Text>
          </View>
        </View>
        {currentMessage.user._id !== userdata && (
          <View
            style={{
              padding: 5,
              backgroundColor: 'grey',
              borderRadius: 50,
              height: 40,
              width: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome6 name="download" color={'white'} size={18} />
          </View>
        )}
      </View>
    </View>
  );
};

const InChatContactTransfer = ({currentMessage, userdata}) => {
  // const {colors} = useTheme();
  const [contactModal, setContactModal] = useState(false);
  const saveContact = () => {
    check(PERMISSIONS.ANDROID.WRITE_CONTACTS).then(res => {
      if (res === RESULTS.GRANTED) {
        console.log(res);
      } else {
        request(PERMISSIONS.ANDROID.WRITE_CONTACTS).then(result => {
          console.log(result);
        });
      }
    });
    const newPerson = {
      displayName: currentMessage.contactDetail.name,
      phoneNumbers: currentMessage.contactDetail.number.map(ele => {
        return {
          label: 'mobile',
          number: ele,
        };
      }),
    };
    openContactForm(newPerson).then(contact => {
      console.log(contact);
    });
  };
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => setContactModal(true)}
        style={[styles.frame, {marginBottom: 5}]}>
        <View style={{flexDirection: 'row', width: '83%'}}>
          <Image
            source={require('../../assets/image/unknownprofile.jpg')}
            style={{
              height: 50,
              width: 50,
              marginVertical: 5,
              marginHorizontal: 10,
              borderRadius: 50,
            }}
          />
          <View style={{maxWidth: '75%', marginTop: 10}}>
            <Text
              style={[
                styles.text,
                currentMessage.user._id !== userdata && {
                  color: Color.defaultBlue,
                },
              ]}>
              {currentMessage.contactDetail.name
                .replace('%20', '')
                .replace(' ', '')}
            </Text>
          </View>
        </View>
      </Pressable>
      <Time
        currentMessage={currentMessage}
        position={currentMessage.user._id !== userdata ? 'left' : 'right'}
      />
      <Pressable
        onPress={() =>
          Linking.openURL(`sms:${currentMessage.contactDetail.number[0]}:rgdrg`)
        }
        style={{
          paddingVertical: 5,
          justifyContent: 'center',
          alignItems: 'center',
          borderTopColor: 'grey',
          borderTopWidth: 0.5,
        }}>
        <Text
          style={[
            {
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
            },
            currentMessage.user._id !== userdata && {
              color: Color.defaultBlue,
            },
          ]}>
          Invite
        </Text>
      </Pressable>
      {contactModal && (
        <Modal
          visible={contactModal}
          animationType="slide"
          onRequestClose={() => setContactModal(false)}>
          <View
            style={{
              height: 60,
              width: '100%',
              backgroundColor: '#0766AD',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                style={{height: '100%'}}
                onPress={() => setContactModal(false)}>
                <Ionicons name="arrow-back" size={20} color={'white'} />
              </TouchableOpacity>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  marginLeft: 10,
                  fontWeight: 'bold',
                }}>
                View Contact
              </Text>
            </View>
          </View>
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
                justifyContent: 'space-between',
                borderBottomColor: 'rgba(0,0,0,0.5)',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
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
                    {currentMessage.contactDetail.name}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => saveContact()}
                style={{
                  marginRight: 15,
                  padding: 10,
                  paddingHorizontal: 15,
                  backgroundColor: 'green',
                  borderRadius: 50,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                  }}>
                  Add
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                marginBottom: 10,
                marginLeft: 10,
                marginRight: 10,
              }}>
              {currentMessage.contactDetail.number.map((number, idx) => {
                return (
                  <View
                    key={idx}
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
                      <Pressable
                        onPress={() =>
                          Linking.openURL(
                            `tel:${currentMessage.contactDetail.number[0]}`,
                          )
                        }>
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
                      </Pressable>
                    </View>
                    {/* <CheckBox
                              checked={
                                values.data[index].checked[idx] === false
                                  ? false
                                  : true
                              }
                              checkedColor="green"
                              onPress={() => {
                                values.data[index].checked[idx] === false
                                  ? (values.data[index].checked[idx] = true)
                                  : (values.data[index].checked[idx] = false);
                                console.log(values.data[index].checked[idx]);
                              }}
                            /> */}
                  </View>
                );
              })}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const InChatCurrentLocation = ({currentMessage, userdata}) => {
  console.log(currentMessage, userdata);
  return (
    <View style={styles.container}>
      <View
        style={[
          {
            height: Platform.OS == 'ios' ? '100%' : 200,
            width: 200,
            borderRadius: 10,
            marginTop: -4,
          },
        ]}>
        <MapView
          style={{flex: 1, alignItems: 'center',borderRadius: 10,}}
          customMapStyle={mapStyle}
          onPress={()=>openMap(currentMessage?.location)}
          region={{
            latitude: currentMessage?.location?.latitude,
            longitude: currentMessage?.location?.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker coordinate={currentMessage?.location}></Marker>
        </MapView>
      </View>
    </View>
  );
};

export {InChatFileTransfer, InChatContactTransfer, InChatCurrentLocation};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    borderRadius: 15,
    padding: 5,
  },
  text: {
    color: 'white',
    marginTop: 8,
    fontSize: 18,
    lineHeight: 20,
    marginLeft: 5,
    marginRight: 5,
    fontWeight: 'bold',
  },
  textType: {
    color: 'white',
    marginTop: 5,
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  frame: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    marginTop: -4,
    alignItems: 'center',
  },
});

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
