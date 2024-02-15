import React, {useEffect, useRef, useState} from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {EditnameModal, ProfileModal} from '../component/ProfileModals';
import {getUserData} from '../component/AllFunctions';
import Header from '../component/Header';
import {useTheme} from '@react-navigation/native';

const Profile = props => {
  const [showModal, setShowModal] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editAbout, setEditAbout] = useState(false);
  const [userData, setUserData] = useState();
  const {colors} = useTheme();

  const inputRef = useRef(null);
  useEffect(() => {
    getUserData(setUserData);
  });
  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 2000);
    return () => clearTimeout(focusTimeout);
  });
  // console.log(base64.decode(userData?.profilePic));
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <View>
      <Header
        style={[(showModal || edit || editAbout) && {opacity: 0.5}]}
        title={'Profile'}
      />
      <View
        style={[
          (showModal || edit || editAbout) && {opacity: 0.4},
          {width: '100%'},
        ]}>
        <View
          style={{
            height: 180,
            justifyContent: 'center',
            alignItems: 'center',
            top: 30,
          }}>
          {userData && userData.profilePic ? (
            <Pressable
              onPress={() =>
                userData.profilePic &&
                props.navigation.navigate('ProfilePic', {
                  profilePic: userData.profilePic,
                })
              }
              style={{height: 150, width: 150}}>
              <Image
                style={{height: 150, width: 150, borderRadius: 100}}
                source={
                  userData && userData.profilePic && {uri: userData.profilePic}
                }
              />
            </Pressable>
          ) : (
            <View
              onPress={() =>
                props.navigation.navigate('ProfilePic', {
                  profilePic: userData.profilePic,
                })
              }
              style={{height: 150, width: 150}}>
              <Image
                style={{height: 150, width: 150, borderRadius: 100}}
                source={require('../../assets/image/unknownprofile.jpg')}
              />
            </View>
          )}
          <Pressable
            onPress={() => {
              setShowModal(true);
            }}
            style={{
              bottom: 40,
              left: 50,
              backgroundColor: '#03C988',
              height: 50,
              width: 50,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <FontAwesome name={'camera'} size={22} color={'black'} />
          </Pressable>
        </View>
        <View style={{marginTop: 20}}>
          <Pressable
            onPress={() => setEdit(true)}
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingVertical: 20,
              paddingLeft: 20,
              backgroundColor: colors.card,
            }}>
            <FontAwesome name={'user'} size={22} color={colors.text} />
            <View style={{width: '75%', marginLeft: 30}}>
              <Text style={{color: colors.text}}>Name</Text>
              <Text
                style={{color: colors.text, fontSize: 18, fontWeight: 'bold'}}>
                {userData?.name}
              </Text>
            </View>
            <FontAwesome name="pencil" size={22} color={'#186F65'} />
          </Pressable>
          <Pressable
            onPress={() => setEditAbout(true)}
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingVertical: 20,
              paddingLeft: 20,
              backgroundColor: colors.card,
            }}>
            <FontAwesome name={'info-circle'} size={22} color={colors.text} />
            <View style={{width: '75%', marginLeft: 30}}>
              <Text style={{color: colors.text}}>About</Text>
              <Text
                style={{color: colors.text, fontSize: 18, fontWeight: 'bold'}}>
                {userData?.about}
              </Text>
            </View>
            <FontAwesome name="pencil" size={22} color={'#186F65'} />
          </Pressable>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              paddingVertical: 20,
              paddingLeft: 20,
              backgroundColor: colors.card,
            }}>
            <FontAwesome name={'phone'} size={22} color={colors.text} />
            <View style={{width: '75%', marginLeft: 30}}>
              <Text style={{color: colors.text}}>Phone</Text>
              <Text
                style={{color: colors.text, fontSize: 18, fontWeight: 'bold'}}>
                {userData?.mobile}
              </Text>
            </View>
          </View>
        </View>
      </View>
      {showModal && (
        <ProfileModal
          showModal={showModal}
          toggleModal={toggleModal}
          userid={userData.userid}
          profilePic={userData && userData.profilePic}
        />
      )}
      {edit && (
        <EditnameModal
          edit={edit}
          setEdit={setEdit}
          editdata={{title: 'name', data: userData.name}}
        />
      )}
      {editAbout && (
        <EditnameModal
          edit={editAbout}
          setEdit={setEditAbout}
          editdata={{title: 'about', data: userData.about}}
        />
      )}
    </View>
  );
};

export default Profile;
