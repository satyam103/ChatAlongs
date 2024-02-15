import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {Image, Pressable, View, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {getFriendsProfileInfo} from '../component/AllFunctions';
import {StyleSheet} from 'react-native';

const FriendsProfilePage = props => {
  const [friendsData, setFriendsData] = useState();
  const [allMedia, setAllMedia] = useState();
  const {colors} = useTheme();
  console.log(props.route.params.item.data);

  useEffect(() => {
    setFriendsData(props.route.params.item.data);
    getFriendsProfileInfo({
      friendsId: props.route.params.item.data.userid,
      setAllMedia: setAllMedia,
    });
  }, [props.route.params.item.data]);
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
            backgroundColor: 'grey',
            padding: 10,
          }}>
          {friendsData && friendsData.profilePic ? (
            <Pressable
              onPress={() =>
                props.navigation.navigate('friendsProfilePic', {
                  profilePic: friendsData.profilePic,
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
            <View style={styles.profileTab}>
              <MaterialIcons name="message" color={colors.text} size={22} />
              <Text style={{color: colors.text}}>Message</Text>
            </View>
            <View style={styles.profileTab}>
              <Ionicons name="call" color={colors.text} size={22} />
              <Text style={{color: colors.text}}>Voice</Text>
            </View>
            <View style={styles.profileTab}>
              <Ionicons name="videocam" color={colors.text} size={22} />
              <Text style={{color: colors.text}}>Video</Text>
            </View>
          </View>
        </View>
        <View
          style={{
            minHeight: 60,
            width: '100%',
            marginVertical: 10,
            padding: 10,
            justifyContent: 'center',
            paddingHorizontal: 20,
            backgroundColor: 'grey',
          }}>
          <Text style={{color: colors.text, fontSize: 16}}>
            {friendsData?.about}About
          </Text>
        </View>
        <View
          style={{
            height: 130,
            width: '100%',
            backgroundColor: 'grey',
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}>
          <Text style={{color: colors.text, fontSize: 16}}>kdbcb</Text>
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
