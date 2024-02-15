import React, {useEffect, useRef, useState} from 'react';
import {Alert, Text} from 'react-native';
import {Pressable, View} from 'react-native';
import {Modal, TouchableWithoutFeedback} from 'react-native';
import {openCamera, openPicker} from 'react-native-image-crop-picker';
import firestore from '@react-native-firebase/firestore';
import {TextInput} from 'react-native';
// import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import {useNavigation} from '@react-navigation/native';
import {Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ProfileModal = props => {
  const [viewPhoto, setViewPhoto] = useState(false);
  const navigation = useNavigation();
  let userid = '';
  useEffect(() => {
    const getData = async () => (userid = await AsyncStorage.getItem('userid'));
    getData();
  });
  const setProfilePic = async imagepath => {
    const fileName = imagepath.substring(imagepath.lastIndexOf('/') + 1);
    const reference = storage().ref(`profile/${fileName}`);
    try {
      await reference.putFile(imagepath);
      const downloadURL = await reference.getDownloadURL();
      firestore()
        .collection('users')
        .doc(userid)
        .update({
          profilePic: downloadURL,
        })
        .then(res => {
          console.log(res);
        })
        .catch(error => console.log(error, 'error in profile modal'));
    } catch (error) {
      console.error('Error uploading image: ', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };
  const removeProfilePic = () => {
    props.toggleModal();
    firestore()
      .collection('users')
      .doc(userid)
      .update({
        profilePic: firestore.FieldValue.delete(),
      })
      .then(res => {
        let imageRef = storage.refFromURL(props.profilePic);
        imageRef.delete();
        console.log(res);
      })
      .catch(error => console.log(error));
  };
  const chooseCamera = () => {
    openCamera({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setProfilePic(image.path);
      })
      .catch(error => {});
  };
  const choosegallery = () => {
    openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        setProfilePic(image.path);
      })
      .catch(error => {});
  };
  const handleViewPhoto = () => {
    navigation.navigate('ProfilePic', {profilePic: props.profilePic});
  };

  return (
    <Modal
      transparent={true}
      onRequestClose={props.toggleModal}
      visible={props.showModal}>
      <TouchableWithoutFeedback onPress={props.toggleModal}>
        <View
          style={{
            alignSelf: 'center',
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            bottom: 50,
          }}>
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: 'rgb(50,60,90)',
                padding: 15,
                borderRadius: 10,
                elevation: 2,
              }}>
              {props.profilePic && (
                <Pressable
                  style={{height: 30, justifyContent: 'center'}}
                  onPress={() => {
                    removeProfilePic();
                    // props.toggleModal();
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    Remove Profile
                  </Text>
                </Pressable>
              )}
              <Pressable
                style={{height: 30, justifyContent: 'center'}}
                onPress={() => {
                  choosegallery();
                  props.toggleModal();
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Select new profile
                </Text>
              </Pressable>
              <Pressable
                style={{height: 30, justifyContent: 'center'}}
                onPress={() => {
                  chooseCamera();
                  props.toggleModal();
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Take new picture
                </Text>
              </Pressable>
              {props.profilePic && (
                <Pressable
                  style={{height: 30, justifyContent: 'center'}}
                  onPress={() => {
                    handleViewPhoto();
                    props.toggleModal();
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    View profile photo
                  </Text>
                </Pressable>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const EditnameModal = props => {
  const inputRef = useRef(null);
  const [userData, setUserdata] = useState();
  let userid = '';
  useEffect(() => {
    const getData = async () => (userid = await AsyncStorage.getItem('userid'));
    getData();
  });
  useEffect(() => {
    const data = () => setUserdata(props?.editdata.data);
    data();
  }, []);
  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 2000);

    // Clear the timeout to avoid any potential memory leaks
    return () => clearTimeout(focusTimeout);
  });
  const changeData = async () => {
    try {
      const res = await firestore()
        .collection('users')
        .doc(userid)
        .update(
          props.editdata.title === 'name'
            ? {
                name: userData,
              }
            : {
                about: userData,
              },
        );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      visible={props.edit}
      transparent={true}
      style={{height: '100%', justifyContent: 'flex-end'}}>
      <TouchableWithoutFeedback
        onPress={() => {
          setUserdata(props.editdata.data);
          props.setEdit(false);
        }}>
        <View
          style={{
            alignSelf: 'center',
            height: '100%',
            width: '100%',
            justifyContent: 'flex-end',
            alignItems: 'center',
            // bottom: 50,
          }}>
          <TouchableWithoutFeedback>
            <View
              style={{
                width: '100%',
                height: 180,
                backgroundColor: 'rgb(50,60,90)',
                padding: 15,
                elevation: 2,
              }}>
              <View
                style={{
                  margin: 5,
                  paddingHorizontal: 20,
                  paddingVertical: 5,
                }}>
                <Text style={{color: 'white', fontSize: 16}}>
                  {props.editdata.title === 'name'
                    ? 'Enter your name'
                    : 'Add about'}
                </Text>
              </View>
              <View
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: 'green',
                  width: 330,
                  alignSelf: 'center',
                  flexDirection: 'row',
                }}>
                <TextInput
                  ref={inputRef}
                  value={userData}
                  maxLength={25}
                  style={{
                    color: 'white',
                    fontSize: 18,
                    width: 300,
                  }}
                  onChangeText={text => setUserdata(text)}
                />
                <Text
                  style={{
                    color: 'white',
                    fontSize: 16,
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  {userData?.length > 0 &&
                    (props.editdata.title === 'name' ? 25 : 150) -
                      userData?.length}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-end',
                  justifyContent: 'center',
                  height: 30,
                  marginVertical: 20,
                }}>
                <Pressable
                  onPress={() => {
                    setUserdata(props.userData);
                    props.setEdit(false);
                  }}
                  style={{
                    margin: 5,
                    width: 60,
                    height: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    Cancel
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    props.setEdit(false);
                    changeData();
                  }}
                  style={{
                    margin: 5,
                    width: 60,
                    height: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    Save
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const UserProfileModal = props => {
  console.log(props);
  return (
    <Modal
      visible={true}
      transparent={true}
      style={{height: '100%',position:'absolute',bottom:100}}>
      <TouchableWithoutFeedback
        onPress={() => {
          props.setViewProfileModal(false);
        }}>
        <View style={{height: '100%', justifyContent: 'flex-end'}}>
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: 'rgb(50,60,90)',
                padding: 5,
                height: 280,
                borderRadius: 10,
                elevation: 2,
                elevation: 5,
                width: '80%',
              }}>
              <Pressable style={{height: 220}}>
                <Image
                  style={{
                    height: '100%',
                    width: '100%',
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                  source={
                    // require('../../assets/image/display.jpg')
                    props.profilePic && {
                      uri: props.profilePic,
                    }
                  }
                />
              </Pressable>
              <View
                style={{
                  flexDirection: 'row',
                  height: 50,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginHorizontal: 20,
                }}>
                <Pressable
                  onPress={() => {
                    props.setViewProfileModal(false);
                    props.navigation.navigate('Chats', {
                      data: item._data,
                      id: userId,
                    });
                  }}>
                  <Ionicons name="chatbox-ellipses" size={22} />
                </Pressable>
                <Pressable>
                  <Ionicons name="call" size={22} />
                </Pressable>
                <Pressable>
                  <Ionicons name="videocam" size={22} />
                </Pressable>
                <Pressable>
                  <Ionicons name="information-circle" size={22} />
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export {ProfileModal, EditnameModal, UserProfileModal};
