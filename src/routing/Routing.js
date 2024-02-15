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
import Header from '../component/Header';
import FriendsProfilePage from '../screen/FriendsProfilePage';

const Routing = () => {
  const Stack = createStackNavigator();
  const [loggedin, setLoggedin] = useState();
  const navigation = useNavigation();

  // ==================== check login ======================
  useEffect(() => {
    checkLogin();
    setTimeout(() => {
      if (loggedin) {
        navigation.navigate('Home');
      }
    }, 1000);
  });
  const checkLogin = async () => {
    const userid = await AsyncStorage.getItem('userid');
    setLoggedin(userid);
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

  const profilePicInterpolate = ({current}) => (
    Animated.spring(a, {
      toValue: 2,
      useNativeDriver: true,
    }).start()
  )
    // cardStyle: {
    //   transform: [
    //     {
    //       translateX: current.progress.interpolate({
    //         inputRange: [0, 1],
    //         outputRange: [400, 0],
    //       }),
    //     },
    //   ],
    // },
  // });

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
          options={{headerShown:true}}
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
        /><Stack.Screen
          name="friendsProfilePage"
          component={FriendsProfilePage}
          options={({route, navigation}) => {}}
        />
      </Stack.Navigator>
    </>
  );
};

export default Routing;
