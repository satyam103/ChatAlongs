import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import Contact from 'react-native-contacts';
import {openCamera, openPicker} from 'react-native-image-crop-picker';

let userid = '';
// ========================= All users datalist ===================
export const getAllData = async setData => {
  userid = await AsyncStorage.getItem('userid');
  const users = await firestore()
    .collection('users')
    .where('userid', '!=', userid)
    .get();
  setData(users.docs);
};
// ========================== logged users data fields ===============================
export const getUserData = async setData => {
  userid = await AsyncStorage.getItem('userid');
  const users = await firestore()
    .collection('users')
    .where('userid', '==', userid)
    .get();
  setData(users.docs[0].data());
};
//  ========================= all setting =============================
export const getAllSettingData = async setData => {
  userid = await AsyncStorage.getItem('userid');
  const chatsettingData = await firestore()
    .collection('users')
    .doc(userid)
    .collection('setting')
    .doc('chatSetting')
    .get();
  setData(chatsettingData.data());
};
// ========================= each contact chat setting ========================
export const getContactSettingData = async (friendsId, setData) => {
  userid = await AsyncStorage.getItem('userid');
  const chatsettingData = await firestore()
    .collection('chats')
    .doc(userid + friendsId)
    .collection('setting')
    .doc('chatSetting')
    .get();
  setData(chatsettingData.data());
};
// ========================== non user contacts ============================
export const getAllContactUserData = async setData => {
  userid = await AsyncStorage.getItem('userid');
  const users = await firestore()
    .collection('users')
    .where('userid', '!=', userid)
    .get();
  const allUserData = users.docs;
  const contactData = await getAllContact();
  const newData =
    allUserData &&
    allUserData.map((values, index) => {
      return values.data().mobile;
    });
  const filteredData = contactData.filter(values => {
    const present = newData.find(value => {
      return values.number.includes(value) && value;
    });
    return present !== undefined && values.name;
  });
  const contactUserData = allUserData
    .filter(values => {
      const presentData = filteredData.find(value => {
        return (
          value.number.includes(values._data.mobile) && {
            ...values._data,
            name: value.name,
          }
        );
      });
      return presentData && {...values.data()};
    })
    .map(values => {
      const presentData = filteredData.find(value => {
        return (
          value.number.includes(values._data.mobile) && {
            ...values._data,
            name: value.name,
          }
        );
      });
      return {...values._data, name: presentData.name};
    });
  setData(contactUserData);
};
export const getNonUserContactData = async setData => {
  userid = await AsyncStorage.getItem('userid');
  const users = await firestore()
    .collection('users')
    .where('userid', '!=', userid)
    .get();
  const allUserData = users.docs;
  const contactData = await getAllContact();
  const newData =
    allUserData &&
    allUserData.map((values, index) => {
      return values.data().mobile;
    });
  const filteredData = contactData.filter(values => {
    const tempArray = [];
    values.number.forEach(element => {
      const present = newData.find(value => {
        return value === element && value;
      });
      if (present === undefined) {
        tempArray.push({name: values.name, number: element});
      }
      return present === undefined && values.number;
    });
    return tempArray;
  });
  const strAscending = [...filteredData].sort((a, b) =>
    a.name > b.name ? 1 : -1,
  );
  setData(strAscending);
};
export const getAllContact = async () => {
  const contactData = await Contact.getAll().then(contacts => {
    const contactdata = contacts.map(values => {
      let number = '';
      let tempArray = [];
      values.phoneNumbers.forEach(element => {
        for (const i of element.number) {
          if (i !== '(' && i != ')' && i != ' ' && i != '-') {
            number += i;
          }
        }
        if (tempArray.includes(number)) {
        } else {
          tempArray.push(number);
        }
        number = '';
      });
      return {number: tempArray, name: values.displayName};
    });
    return contactdata;
  });
  return contactData;
};
// ============================ get fcm token ==================================
export const  getToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('old token', fcmToken);
  if (!fcmToken) {
    try {
      await messaging().registerDeviceForRemoteMessages();
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log(fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error);
    }
  }
};
// ============================== FCM notification =====================================
export const notification = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging().onMessage(async remoteMessage => {
    console.log('Foreground', JSON.stringify(remoteMessage));
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};
// =============================== set Profile ==================================
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
export const chooseCamera = ({toggleModal}) => {
  openCamera({
    width: 300,
    height: 400,
    cropping: true,
  })
    .then(image => {
      setProfilePic(image.path);
      toggleModal();
    })
    .catch(error => {});
};
export const choosegallery = ({toggleModal}) => {
  openPicker({
    width: 300,
    height: 400,
    cropping: true,
  })
    .then(image => {
      setProfilePic(image.path);
      toggleModal();
    })
    .catch(error => {});
};
// ================================== remove profile pic ===========================
export const removeProfilePic = ({profilePic, toggleModal}) => {
  console.log(profilePic);
  firestore()
    .collection('users')
    .doc(userid)
    .update({
      profilePic: firestore.FieldValue.delete(),
    })
    .then(res => {
      let imageRef = storage().refFromURL(props.profilePic);
      imageRef.delete();
      toggleModal();
      console.log(res);
    })
    .catch(error => console.log(error));
};
// ================================ get friends Profile Info ===============================
export const getFriendsProfileInfo = async ({friendsId, setAllMedia}) => {
  userid = await AsyncStorage.getItem('userid');
  const media = firestore()
    .collection('chats')
    .doc(userid + friendsId)
    .collection('media')
    .orderBy('createdAt', 'desc');
  media.onSnapshot(querysnapshot => {
    const allmessages = querysnapshot.docs.map(item => {
      return item._data;
    });
    setAllMedia(allmessages);
  });
};
