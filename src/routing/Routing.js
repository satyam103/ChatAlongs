import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screen/Login';
import Home from '../screen/Home';
import Chats from '../screen/Chats';
import NewGroup from '../screen/NewGroup';
import Settings from '../screen/Settings';
import Invite from '../screen/Invite';
import Profile from '../screen/Profile';
import Accounts from '../screen/Accounts';
import ChatsSetting from '../screen/ChatsSetting';
import About from '../screen/About';
import ChatWallpaper from '../screen/ChatWallpaper';
import Wallpaper from '../screen/Wallpaper';
import CallingPage from '../screen/CallingPage';
import {ProfilePic, FriendsProfilePic} from '../screen/ProfilePic';
import FriendsProfilePage from '../screen/FriendsProfilePage';
import MediaPage from '../screen/MediaPage';
import {SendContact, SendDocs, SendImages} from '../component/ChatSelectitem';
import SendLocation from '../screen/SendLocation';
import ShareContact from '../screen/ShareContact';
import {useDispatch} from 'react-redux';
import {addUserdata} from '../redux/slice/Userslice';
import firestore from '@react-native-firebase/firestore';
import { getAllContact, getAllSettingData, notification } from '../component/AllFunctions';

const Routing = () => {
  const Stack = createStackNavigator();
  const [loggedin, setLoggedin] = useState();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // ==================== check login ======================
  useEffect(() => {
    setTimeout(() => {
      checkLogin();
      if (loggedin) {
        navigation.navigate('Home');
      }
    }, 1000);
    notification(navigation)
  });
  const checkLogin = async () => {
    const userid = await AsyncStorage.getItem('userid');
    if (userid) {
      firestore()
        .collection('users')
        .where('userid', '==', userid)
        .get()
        .then(async res => {
          if (res.docs[0]) {
            const contact = getAllContact()
            const setting = getAllSettingData()
            dispatch(addUserdata({userdata:res.docs[0]._data,contact:await contact,setting:await setting}));
            setLoggedin(userid); 
            navigation.navigate('Home');
          }
        })
        .catch(error => console.log(error));
    }
  };

  const cardStyleInterpolator = ({current}) => ({
    cardStyle: {
      transform: [
        {
          translateX: current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [400, 0],
          }),
        },
      ],
    },
  });

  const profilePicInterpolate = ({current}) =>
    Animated.spring(a, {
      toValue: 2,
      useNativeDriver: true,
    }).start();

  return (
    <>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false, cardStyleInterpolator}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Home"
          component={Home}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="Chats"
          component={Chats}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="newGroup"
          component={NewGroup}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="settings"
          component={Settings}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="invite"
          component={Invite}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="profile"
          component={Profile}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="account"
          component={Accounts}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="chatsSetting"
          component={ChatsSetting}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="about"
          component={About}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="wallpaper"
          component={Wallpaper}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="chatWallpaper"
          component={ChatWallpaper}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="Call"
          component={CallingPage}
          options={{headerShown: true}}
        />
        <Stack.Screen
          name="ProfilePic"
          component={ProfilePic}
          options={{profilePicInterpolate}}
        />
        <Stack.Screen
          name="friendsProfilePic"
          component={FriendsProfilePic}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="friendsProfilePage"
          component={FriendsProfilePage}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="MediaPage"
          component={MediaPage}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="SendImages"
          component={SendImages}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="SendDocs"
          component={SendDocs}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="sendLocation"
          component={SendLocation}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="shareContact"
          component={ShareContact}
          options={({route, navigation}) => {}}
        />
        <Stack.Screen
          name="sendContact"
          component={SendContact}
          options={({route, navigation}) => {}}
        />
      </Stack.Navigator>
    </>
  );
};

export default Routing;
