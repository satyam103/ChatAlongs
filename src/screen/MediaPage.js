import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-viewing';
import {useSelector} from 'react-redux';

const MediaPage = props => {
  const [currIndex, setCurrIndex] = useState(props?.route?.params?.imageIndex);
  const userData = useSelector(state => state.user.userData);
  // console.log(props?.route?.params?.data[props?.route?.params?.imageIndex]?.image);
  const headerComponent = imageIndex => {
    // console.log(
    //   imageIndex,
    //   props?.route?.params?.data[
    //     imageIndex === undefined ? props?.route?.params?.imageIndex : imageIndex
    //   ]?.user?._id ,userData[0].userid
    // );

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
              {props?.route?.params?.data[
                imageIndex === undefined
                  ? props?.route?.params?.imageIndex
                  : imageIndex
              ]?.user?._id === userData[0].userid
                ? 'You'
                : props?.route?.params?.friendData?.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  const footerComponent = () => {
    return (
      <View
        style={{
          height: 80,
          backgroundColor: 'rgba(0,0,0,0)',
          width: '100%',
          alignItems: 'center',
        }}>
        <Text>{props?.route?.params?.data?.text}</Text>
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
          HeaderComponent={item => headerComponent(item.imageIndex)}
          FooterComponent={footerComponent}
          images={props?.route?.params?.data}
          // images={[{uri:props?.route?.params?.data[props?.route?.params?.imageIndex]?.image}]}
          imageIndex={props?.route?.params?.imageIndex}
          keyExtractor={item => item.imageIndex}
          onImageIndexChange={item => setCurrIndex(item)}
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

export default MediaPage;
