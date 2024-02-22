import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Pressable, Modal} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Time} from 'react-native-gifted-chat';
import {TouchableOpacity} from 'react-native';

const InChatFileTransfer = ({filePath}) => {
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
          <View style={{maxWidth: '75%'}}>
            <Text lineBreakMode="clip" numberOfLines={1} style={styles.text}>
              {name.replace('%20', '').replace(' ', '')}
            </Text>
            <Text style={styles.textType}>{fileType.toUpperCase()}</Text>
          </View>
        </View>
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
      </View>
    </View>
  );
};

const InChatContactTransfer = ({currentMessage, userdata}) => {
  const [contactModal, setContactModal] = useState(false);
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
            <Text style={styles.text}>
              {currentMessage.contactDetail.name
                .replace('%20', '')
                .replace(' ', '')}
            </Text>
          </View>
        </View>
      </Pressable>
      <Time
        currentMessage={currentMessage}
        position={currentMessage.user._id === userdata ? 'left' : 'right'}
      />
      <Pressable
        onPress={() => console.log('invited')}
        style={{
          paddingVertical: 5,
          justifyContent: 'center',
          alignItems: 'center',
          borderTopColor: 'grey',
          borderTopWidth: 0.5,
        }}>
        <Text style={{color: 'white', fontSize: 16, fontWeight: 'bold'}}>
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
                  {currentMessage.contactDetail.name}
                </Text>
              </View>
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

export {InChatFileTransfer, InChatContactTransfer};

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
