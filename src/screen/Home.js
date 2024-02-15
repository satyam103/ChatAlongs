import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Dropdown, {RenderDropdown} from '../component/Dropdown';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {
  getAllContactUserData,
  getAllData,
  getToken,
} from '../component/AllFunctions';
import {useTheme} from '@react-navigation/native';
import {Modal} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import Lightbox from 'react-native-lightbox-v2';
import {UserProfileModal} from '../component/ProfileModals';
// import Animated  from 'react-native-reanimated';

let userId = '';
const Home = props => {
  const {colors} = useTheme();
  const [allUsers, setAllUser] = useState();
  const [modalData, setModalData] = useState({});
  const [spinner, setSpinner] = useState(false);
  const [dropdown, setDropDown] = useState(false);
  const [allContactUsers, setAllContactsUser] = useState();
  const [viewProfileModal, setViewProfileModal] = useState(false);

  const menu = [
    {name: 'New Group', page: 'newGroup'},
    {name: 'Settings', page: 'settings'},
    {name: 'Invite a friend', page: 'invite'},
  ];

  useEffect(() => {
    setSpinner(true);
    setTimeout(() => {
      getData();
      // getAllData(setAllUserr);
      getAllContactUserData(setAllContactsUser);
      getToken();
      setSpinner(false);
    }, 3000);
  }, []);
  const getData = async () => {
    userId = await AsyncStorage.getItem('userid');
  };

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  // const transition = SharedTransition.custom(values => {
  //   'worklet';
  //   return {
  //     height: withSpring(values.targetHeight),
  //     width: withSpring(values.targetWidth),
  //   };
  // });
  return (
    <View>
      <View onPress={()=> setDropDown(false)} style={{height: 120, backgroundColor: '#0766AD'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 15,
            marginHorizontal: 5,
            padding: 5,
          }}>
          <Text style={{fontSize: 22, color: 'white'}}>ChatAlong</Text>
          <View>
            <Dropdown visible={dropdown} setVisible={setDropDown} />
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: 15,
            marginHorizontal: 5,
            padding: 5,
            bottom: 5,
          }}>
          <Ionicons name="people" size={24} color={'white'} />
          <Text style={{fontSize: 18, color: 'white'}}>Chats</Text>
          <Text style={{fontSize: 18, color: 'white'}}>Calls</Text>
        </View>
      </View>
      {spinner && allContactUsers ? (
        <View style={{justifyContent: 'center', height: '80%'}}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={{height: '90%', backgroundColor: colors.background}}>
          <ScrollView>
            {allContactUsers &&
              allContactUsers.map((item, index) => {
                return (
                  <View
                    activeOpacity={0.6}
                    key={index}
                    style={{
                      height: 70,
                      backgroundColor: colors.card,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 5,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Pressable
                        onPress={() => {
                          setModalData({
                            profilePic: item.data().profilePic,
                            data: item._data,
                            id: userId,
                          });
                          setViewProfileModal(true);
                        }}>
                        <Image
                          source={
                            item.data() && item.data().profilePic
                              ? {uri: item.data().profilePic}
                              : require('../../assets/image/unknownprofile.jpg')
                          }
                          style={{
                            height: 40,
                            width: 40,
                            borderRadius: 20,
                            marginLeft: 5,
                          }}
                        />
                      </Pressable>
                      <TouchableOpacity
                        style={{width: '100%'}}
                        onPress={() => {
                          setDropDown(false);
                          props.navigation.navigate('Chats', {
                            data: item._data,
                            id: userId,
                          });
                        }}>
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            marginLeft: 10,
                            color: colors.text,
                          }}>
                          {item.data().name
                            ? item.data().name
                            : item.data().mobile}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {viewProfileModal && (
                      <Modal
                        // visible={viewProfileModal}
                        transparent={true}
                        animationType='fade'
                        style={{height: '100%', justifyContent: 'flex-end'}}>
                        <TouchableWithoutFeedback
                          onPress={() => {
                            setViewProfileModal(false);
                          }}>
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
                                  height: 320,
                                  elevation: 5,
                                  width: '75%',
                                }}>
                                <Pressable
                                  onPress={() => {
                                    setViewProfileModal(false);
                                    props.navigation.navigate(
                                      'friendsProfilePic',
                                      {
                                        profilePic: modalData.profilePic,
                                        username: modalData.data.name,
                                      },
                                    );
                                  }}
                                  style={{height: 265}}>
                                  <Image
                                    style={{
                                      height: '100%',
                                      width: '100%',
                                    }}
                                    source={
                                      modalData.profilePic && {
                                        uri: modalData.profilePic,
                                      }
                                    }
                                  />
                                </Pressable>
                                <View
                                  style={{
                                    backgroundColor: 'rgba(0,0,0,0.2)',
                                    position: 'absolute',
                                    width: '100%',
                                    paddingHorizontal: 10,
                                    height: 30,
                                    justifyContent: 'center',
                                  }}>
                                  <Text style={{fontSize: 20}}>
                                    {modalData.data.name}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    height: 50,
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginHorizontal: 30,
                                    // color:'green',
                                  }}>
                                  <Pressable
                                    onPress={() => {
                                      setViewProfileModal(false);
                                      props.navigation.navigate('Chats', {
                                        data: modalData.data,
                                        id: modalData.id,
                                      });
                                    }}>
                                    <MaterialIcon name="message" size={22} />
                                  </Pressable>
                                  <Pressable
                                    onPress={() => {
                                      setViewProfileModal(false);
                                      props.navigation.navigate('Call', {
                                        userid: modalData.id,
                                        call: 'voice call',
                                      });
                                    }}>
                                    <Ionicons name="call" size={22} />
                                  </Pressable>
                                  <Pressable
                                    onPress={() => {
                                      setViewProfileModal(false);
                                      props.navigation.navigate('Call', {
                                        userid: modalData.id,
                                        call: 'agora',
                                      });
                                    }}>
                                    <Ionicons name="videocam" size={22} />
                                  </Pressable>
                                  <Pressable
                                    onPress={() => {
                                      setViewProfileModal(false);
                                      props.navigation.navigate('friendsProfilePage',{item:modalData})
                                    }}>
                                    <Ionicons
                                      name="information-circle"
                                      size={22}
                                    />
                                  </Pressable>
                                </View>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </TouchableWithoutFeedback>
                      </Modal>
                    )}
                  </View>
                );
              })}
          </ScrollView>
        </View>
      )}
      {dropdown && <RenderDropdown dataList={menu} setDropDown={setDropDown} dropdown={dropdown}/>}
    </View>
  );
};
const styles = StyleSheet.create({
  icons: {
    margin: 5,
  },
});

export default Home;
