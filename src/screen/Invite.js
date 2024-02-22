import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Header from '../component/Header';
import Contact from 'react-native-contacts';
import {getAllData, getNonUserContactData} from '../component/AllFunctions';
import {useTheme} from '@react-navigation/native';

const Invite = props => {
  const [nonUserContacts, setNonUserContacts] = useState();
  const {colors} = useTheme();
  useEffect(() => {
    setTimeout(() => {
      getNonUserContactData(setNonUserContacts);
    }, 2000);
  }, []);

  return (
    <View>
      <Header title={'Invite a friend'} />
      {!nonUserContacts ? (
        <View style={{justifyContent: 'center', height: '80%'}}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
          <ScrollView style={{height: '100%'}}>
            {nonUserContacts &&
              nonUserContacts.map((element, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 5,
                      justifyContent: 'space-between',
                      height: 70,
                      backgroundColor: colors.card,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={require('../../assets/image/unknownprofile.jpg')}
                        style={{height: 50, width: 50, borderRadius: 50}}
                      />
                      <View style={{marginHorizontal: 15}}>
                        <Text style={{color: colors.text, fontSize: 18}}>
                          {element && element.name}
                        </Text>
                        <Text style={{color: colors.text}}>
                          {element && element.number}
                        </Text>
                      </View>
                    </View>
                    <Pressable
                      style={{marginRight: 20}}
                      onPress={() => {
                        console.log('Invited');
                      }}>
                      <Text style={{color: '#16FF00', fontSize: 20}}>
                        + Invite
                      </Text>
                    </Pressable>
                  </View>
                );
              })}
          </ScrollView>
      )}
    </View>
  );
};

export default Invite;
