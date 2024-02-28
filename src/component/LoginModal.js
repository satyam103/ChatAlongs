import firestore, {firebase} from '@react-native-firebase/firestore';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as yup from 'yup';
import auth from '@react-native-firebase/auth';
import {Formik} from 'formik';
import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {useDispatch} from 'react-redux';
import {addUserdata} from '../redux/slice/Userslice';
import {KeyboardAvoidingView} from 'react-native';

// import {
//   getAuth,
//   RecaptchaVerifier,
//   verifyPhoneNumber
// } from '@react-native-firebase/auth';
// import RNCRecaptcha from 'react-native-recaptcha';

const loginSchema = yup.object({
  mobile: yup.number().required(),
  name: yup.string().required(),
});
const LoginModal = props => {
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState();
  const [loading, setLoading] = useState(false);

  // old one  \/\/\/\/\/\/\/\/\/\/\/\/================================
  const [confirm, setConfirm] = useState(null);
  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState('');
  const [user, setUser] = useState(null);
  function onAuthStateChanged(user) {
    if (user) setUser(user);

    console.log(user);
  }
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '317087103968-qul308mf604vhhf8c4kikg7u9qesveqc.apps.googleusercontent.com',
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error) {
      console.log(error);
    }
  };

  async function signinWithPhoneNumber(phoneNumber) {
    const settings = auth().settings;
    settings.forceRecaptchaFlowForTesting=true;
    // console.log(settings.forceRecaptchaFlowForTesting,'ljhgghghcgvh');

    console.log(phoneNumber + 'jhhklk');
    // setLoading(true);
    const confirmation = await auth().signInWithPhoneNumber('+919984780520');
    console.log(confirmation + '=====================');
    console.log(phoneNumber + 'jhhklk');
    // setLoading(false);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
      console.log('object');
      // loginUser(loginData);
    } catch (error) {
      console.log('Invalid code.');
    }
  }

  // other =================================
  const loginUser = ({name, mobile}) => {
    firestore()
      .collection('users')
      .where('mobile', '==', mobile)
      .get()
      .then(res => {
        if (res.docs[0]) {
          goToNext(
            res.docs[0].data().mobile,
            res.docs[0].data().userid,
            res.docs[0].data().name,
          );
        } else {
          const userid = uuid.v4();
          firestore()
            .collection('users')
            .doc(userid)
            .set({
              name: name,
              mobile: mobile,
              userid: userid,
            })
            .then(res => {
              goToNext(mobile, userid, name);
            })
            .catch(error => console.log(error));
        }
      })
      .catch(error => console.log(error));
  };

  const goToNext = async (mobile, userid, name) => {
    await AsyncStorage.setItem('mobile', mobile);
    await AsyncStorage.setItem('name', name);
    await AsyncStorage.setItem('userid', userid);
    props.onModalClose();
    props.onlogin();
  };
  return (
    <>
      <Modal
        style={[{height: '50%'}]}
        animationType="slide"
        transparent={true}
        visible={props.modal}>
        <View
          style={[
            loading && {opacity: 0.5},
            {
              top: '50%',
              borderRadius: 10,
              elevation: 5,
              height: '50%',
              backgroundColor: 'white',
              padding: 20,
            },
            !loading && {
              top: '50%',
              borderRadius: 10,
              elevation: 5,
              height: '50%',
              backgroundColor: 'white',
              padding: 20,
            },
          ]}>
          <View
            style={{
              alignItems: 'flex-end',
              backgroundColor: 'rgb(240,240,240)',
              height: 40,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}>
            <Pressable onPress={() => props.onModalClose()}>
              <Ionicons name="close" size={22} />
            </Pressable>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: '80%',
            }}>
            <Formik
              initialValues={{mobile: '+91', name: ''}}
              validationSchema={loginSchema}
              onSubmit={(values, action) => {
                // signinWithPhoneNumber(values.mobile);
                setLoginData(values);
                loginUser(values);
              }}>
              {({
                handleChange,
                handleSubmit,
                handleBlur,
                touched,
                values,
                errors,
              }) => (
                <>
                  <View
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <TextInput
                      style={{
                        borderColor: 'black',
                        color: 'black',
                        padding: 5,
                        paddingHorizontal: 20,
                        borderRadius: 20,
                        backgroundColor: 'rgb(233,233,233)',
                        width: '70%',
                        marginVertical: 5,
                        borderWidth: 0,
                      }}
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      placeholder="Enter Your Name"
                    />
                    {touched.name && errors.name && (
                      <Text
                        style={{
                          color: 'red',
                          textAlign: 'center',
                          marginBottom: 5,
                        }}>
                        {errors.name}
                      </Text>
                    )}
                    <TextInput
                      style={{
                        borderColor: 'black',
                        color: 'black',
                        marginVertical: 5,
                        borderWidth: 0,
                        padding: 5,
                        paddingHorizontal: 20,
                        borderRadius: 20,
                        backgroundColor: 'rgb(233,233,233)',
                        width: '70%',
                      }}
                      value={values.mobile}
                      onChangeText={handleChange('mobile')}
                      onBlur={handleBlur('mobile')}
                      placeholder="Enter Your Number"
                      keyboardType="numeric"
                    />
                    {touched.mobile && errors.mobile && (
                      <Text
                        style={{
                          color: 'red',
                          textAlign: 'center',
                          marginBottom: 5,
                        }}>
                        {errors.mobile}
                      </Text>
                    )}
                  </View>
                  <Pressable
                    style={{
                      marginTop: 10,
                      height: 50,
                      borderRadius: 10,
                      backgroundColor: 'rgb(100,100,245)',
                      width: 100,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    onPress={handleSubmit}>
                    <Text style={{color: 'white', fontWeight: 'bold'}}>
                      Login
                    </Text>
                  </Pressable>

                  {/* <GoogleSigninButton
                    size={GoogleSigninButton.Size.Icon}
                    onPress={() => signIn()}
                  /> */}
                </>
              )}
            </Formik>
          </View>
        </View>
      </Modal>

      {confirm && (
        <Modal style={{height: '50%'}} animationType="slide" transparent={true}>
          <View
            style={{
              // top: '50%',
              borderRadius: 10,
              elevation: 5,
              height: '50%',
              backgroundColor: 'white',
              padding: 20,
            }}>
            <TextInput
              style={{
                height: 50,
                width: 200,
                paddingHorizontal: 10,
                paddingVertical: 5,
                backgroundColor: 'rgb(233,233,233)',
                borderRadius: 10,
              }}
              value={code}
              onChangeText={text => setCode(text)}
            />
            <Pressable
              style={{
                backgroundColor: 'rgb(100,100,240)',
                width: 100,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 10,
              }}
              onPress={() => confirmCode()}>
              <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
                Confim OTP
              </Text>
            </Pressable>
          </View>
        </Modal>
      )}
    </>
  );
};

export default LoginModal;
