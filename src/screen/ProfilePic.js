import React, {useState} from 'react';
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-viewing';
import {
  chooseCamera,
  choosegallery,
  removeProfilePic,
} from '../component/AllFunctions';

const ProfilePic = props => {
  const [visible, setVisible] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false);

  const headerComponent = () => {
    return (
      <View
        style={{
          height: 60,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{height: '100%', flexDirection: 'row', alignItems: 'center'}}
            onPress={() => props.navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={'white'} />
            <Text style={{marginLeft: 20, fontSize: 22, color: 'white'}}>
              Profile Photo
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Pressable
            onPress={() => setRemoveModal(true)}
            style={{marginHorizontal: 10, alignItems: 'center'}}>
            <Ionicons name="trash" size={22} color={'white'} />
          </Pressable>
          <Pressable
            onPress={() => setEditModal(true)}
            style={{marginHorizontal: 10, alignItems: 'center'}}>
            <Ionicons name="pencil" size={22} color={'white'} />
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View
        style={[
          {
            height: '100%',
            width: '100%',
            alignContent: 'center',
            justifyContent: 'center',
          },
        ]}>
        <ImageView
          HeaderComponent={headerComponent}
          images={[
            props &&
              props.route &&
              props.route.params &&
              props.route.params.profilePic && {
                uri: props.route.params.profilePic,
              },
          ]}
          swipeToCloseEnabled={true}
          visible={visible}
          onRequestClose={() => {
            setVisible(false);
            props.navigation.goBack();
          }}
        />
      </View>
      <Modal
        visible={editModal}
        transparent={true}
        style={{height: '100%', justifyContent: 'flex-end'}}>
        <TouchableWithoutFeedback
          onPress={() => {
            setEditModal(false);
          }}>
          <View
            style={{
              alignSelf: 'center',
              height: '100%',
              width: '100%',
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback>
              <View
                style={{
                  padding: 15,
                  height: 140,
                  elevation: 5,
                  width: '100%',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  //   backgroundColor: 'white',
                  backgroundColor: 'rgb(50,60,90)',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <Pressable
                    onPress={() =>
                      chooseCamera({toggleModal: props.navigation.goBack})
                    }
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesome name="camera" size={32} />
                    <Text style={{marginTop: 5}}>Camera</Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      choosegallery({toggleModal: props.navigation.goBack})
                    }
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <FontAwesome name="photo" size={32} />
                    <Text style={{marginTop: 5}}>Gallery</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal visible={removeModal} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setRemoveModal(false)}>
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
                  height: 120,
                  borderRadius: 10,
                  elevation: 2,
                  elevation: 5,
                  width: '80%',
                }}>
                <View
                  style={{
                    borderBottomWidth: 0.5,
                    borderBottomColor: 'white',
                    height: '60%',
                  }}>
                  <Text style={{marginTop: 5, fontSize: 18}}>
                    Are you sure ?
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: '50%',
                    justifyContent: 'flex-end',
                  }}>
                  <Pressable
                    onPress={() => setRemoveModal(false)}
                    style={{marginHorizontal: 10}}>
                    <Text>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={() =>
                      removeProfilePic({
                        profilePic: props.route.params.profilePic,
                        toggleModal: props.navigation.goBack,
                      })
                    }
                    style={{marginHorizontal: 10}}>
                    <Text>Yes</Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const FriendsProfilePic = props => {
  const headerComponent = () => {
    return (
      <View
        style={{
          height: 60,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity
            style={{height: '100%', flexDirection: 'row', alignItems: 'center'}}
            onPress={() => props.navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color={'white'} />
            <Text style={{marginLeft: 20, fontSize: 22, color: 'white'}}>
              {props.route.params.username}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View>
      <View
        style={[
          {
            height: '100%',
            width: '100%',
            alignContent: 'center',
            justifyContent: 'center',
          },
        ]}>
        <ImageView
          HeaderComponent={headerComponent}
          images={[
            props &&
              props.route &&
              props.route.params &&
              props.route.params.profilePic && {
                uri: props.route.params.profilePic,
              },
          ]}
          swipeToCloseEnabled={true}
          visible={true}
          onRequestClose={() => {
            props.navigation.goBack();
          }}
        />
      </View>
    </View>
  );
};

export {ProfilePic, FriendsProfilePic};
