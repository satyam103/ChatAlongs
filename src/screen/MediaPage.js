import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageView from 'react-native-image-viewing';

const MediaPage = props => {
  console.log(props?.route?.params?.data);
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
              {/* {props.route.params.username} */}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };  
  const footerComponent = () => {
    return (
      <View
        style={{height: 80, backgroundColor:'rgba(0,0,0,0)', width: '100%', alignItems: 'center'}}>
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
          HeaderComponent={headerComponent}
          FooterComponent={footerComponent}
          images={
            props?.route?.params?.data
          }
          imageIndex={props?.route?.params?.imageIndex}
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
