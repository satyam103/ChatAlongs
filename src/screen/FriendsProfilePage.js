import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Pressable, View, Text, FlatList} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getFriendsProfileInfo} from '../component/AllFunctions';
import {StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

let userid = '';
const FriendsProfilePage = props => {
  const [friendsData, setFriendsData] = useState(
    props?.route?.params?.item?.data,
  );
  const [allMedia, setAllMedia] = useState();
  const [allDocs, setAllDocs] = useState();
  const {colors} = useTheme();
  // console.log(props.route.params, '=======================friendprofile');
  useEffect(() => {
    getData();
    getFriendsProfileInfo({
      friendsId: props?.route?.params?.item?.data?.userid,
      setAllMedia: setAllMedia,
      setAllDocs: setAllDocs,
    });
  }, []);
  const getData = async () => {
    userid = await AsyncStorage.getItem('userid');
  };
  const filteredMediaFile = allMedia?.map(item => {
    return {...item, uri: item.image};
  });
  // console.log(userid);
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 20,
        }}>
        <Pressable onPress={() => props.navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <Pressable>
          <FontAwesome name="ellipsis-v" size={22} color={colors.text} />
        </Pressable>
      </View>
      <View style={{position: 'absolute', width: '100%'}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '',
            padding: 10,
          }}>
          {friendsData && friendsData.profilePic ? (
            <Pressable
              onPress={() =>
                friendsData.profilePic &&
                props.navigation.navigate('friendsProfilePic', {
                  profilePic: friendsData?.profilePic,
                  username: friendsData?.name,
                })
              }
              style={{height: 160, width: 160}}>
              <Image
                style={{height: 160, width: 160, borderRadius: 100}}
                source={
                  friendsData &&
                  friendsData.profilePic && {uri: friendsData.profilePic}
                }
              />
            </Pressable>
          ) : (
            <View
              onPress={() =>
                props.navigation.navigate('friendsProfilePic', {
                  profilePic: friendsData.profilePic,
                })
              }
              style={{height: 150, width: 150}}>
              <Image
                style={{height: 150, width: 150, borderRadius: 100}}
                source={require('../../assets/image/unknownprofile.jpg')}
              />
            </View>
          )}
          <View style={{alignItems: 'center'}}>
            <Text style={{color: colors.text, fontSize: 22, marginTop: 10}}>
              {friendsData?.name}
            </Text>
            <Text style={{color: colors.text, fontSize: 20}}>
              {friendsData?.mobile}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              marginTop: 15,
            }}>
            <Pressable
              onPress={() =>
                props.navigation.navigate('Chats', {
                  data: friendsData,
                  id: userid,
                })
              }
              style={styles.profileTab}>
              <MaterialIcons name="message" color={'#03C988'} size={22} />
              <Text style={{color: colors.text}}>Message</Text>
            </Pressable>
            <Pressable
              style={styles.profileTab}
              onPress={() =>
                props.navigation.navigate('Call', {
                  userid: userid,
                  call: 'voice call',
                })
              }>
              <Ionicons name="call" color={'#03C988'} size={22} />
              <Text style={{color: colors.text}}>Voice</Text>
            </Pressable>
            <Pressable
              style={styles.profileTab}
              onPress={() =>
                props.navigation.navigate('Call', {
                  userid: userid,
                  call: 'agora',
                })
              }>
              <Ionicons name="videocam" color={'#03C988'} size={22} />
              <Text style={{color: colors.text}}>Video</Text>
            </Pressable>
          </View>
        </View>
        {friendsData?.about && (
          <View
            style={{
              minHeight: 60,
              width: '100%',
              marginVertical: 10,
              padding: 10,
              justifyContent: 'center',
              paddingHorizontal: 20,
              backgroundColor: '',
            }}>
            <Text style={{color: colors.text, fontSize: 16}}>
              {friendsData?.about}asd
            </Text>
          </View>
        )}
        {(allMedia?.length > 0 || allDocs?.length > 0) && (
          <View
            style={{
              height: 150,
              width: '100%',
              backgroundColor: 'white',
              marginHorizontal: 5,
              paddingVertical: 10,
              paddingHorizontal: 10,
            }}>
            <Pressable
              onPress={() =>
                props.navigation.navigate('MediaLinkDocs', {
                  friendsData: props?.route?.params?.item?.data,
                })
              }
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 10,
                marginBottom: 5,
              }}>
              <Text style={{fontSize: 16, color: colors.text}}>
                Media, links, and docs
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: colors.text,
                    marginRight: 3,
                    fontSize: 16,
                    alignItems: 'center',
                  }}>
                  {allMedia?.length > 0 ? allMedia?.length : ''}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.text}
                />
              </View>
            </Pressable>
            <FlatList
              horizontal={true}
              data={allMedia}
              initialNumToRender={10}
              showsHorizontalScrollIndicator={false}
              renderItem={item => {
                // console.log(item);
                return (
                  <Pressable
                    onPress={() =>
                      props.navigation.navigate('MediaPage', {
                        imageIndex: item.index,
                        data: filteredMediaFile,
                        friendData: props?.route?.params?.data,
                      })
                    }
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 15,
                      padding: 5,
                      marginRight: 5,
                    }}>
                    <Image
                      style={{height: 100, width: 100, borderRadius: 15}}
                      source={{uri: item?.item?.image}}
                    />
                  </Pressable>
                );
              }}
            />
          </View>
        )}
        <View
          style={{
            width: '100%',
            backgroundColor: '',
            marginVertical: 10,
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}>
          <Pressable
            onPress={() => console.log('block')}
            style={{
              flexDirection: 'row',
              marginVertical: 10,
              alignItems: 'center',
            }}>
            <Ionicons
              style={{transform: [{rotateY: '180deg'}]}}
              name="ban"
              size={22}
              color={'#B31312'}
            />
            <Text
              style={{
                fontSize: 18,
                marginHorizontal: 10,
                color: '#B31312',
                fontWeight: 'bold',
              }}>
              Block {friendsData?.name}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => console.log('report')}
            style={{
              flexDirection: 'row',
              marginVertical: 10,
              alignItems: 'center',
            }}>
            <FontAwesome
              style={{transform: [{rotateY: '180deg'}]}}
              name="thumbs-down"
              size={22}
              color={'#B31312'}
            />
            <Text
              style={{
                fontSize: 18,
                marginHorizontal: 10,
                color: '#B31312',
                fontWeight: 'bold',
              }}>
              Report {friendsData?.name}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  profileTab: {
    width: 80,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 0.5,
    backgroundColor: 'rgb(230,230,230)',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
});

export default FriendsProfilePage;
