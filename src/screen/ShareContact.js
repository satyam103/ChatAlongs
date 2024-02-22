import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../component/Header';
import Contact from 'react-native-contacts';
import {getNonUserContactData} from '../component/AllFunctions';
import {useTheme} from '@react-navigation/native';

const ShareContact = props => {
  const [allUserContacts, setAllUserContacts] = useState();
  const [selectedContact, setSelectedContact] = useState([]);
  const selectedContactRef = useRef();
  const {colors} = useTheme();
  useEffect(() => {
    setTimeout(() => {
      getNonUserContactData(setAllUserContacts);
    }, 2000);
  }, []);

  const toggelSelection = item => {
    if (selectedContact.includes(item)) {
      setSelectedContact(prev =>
        prev.filter(values => values.name !== item.name),
      );
    } else {
      setSelectedContact(prev => [...prev, item]);
    }
  };

  return (
    <View>
      <Header title={'Contacts to send'} />
      {!allUserContacts ? (
        <View style={{justifyContent: 'center', height: '80%'}}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          {selectedContact.length > 0 && (
            <View
              style={{
                height: 90,
                borderBottomWidth: 0.5,
                borderBottomColor: 'rgba(0,0,0,0.5)',
                paddingVertical: 10,
              }}>
              <FlatList
                ref={selectedContactRef}
                horizontal={true}
                keyExtractor={item => item.index}
                data={selectedContact}
                renderItem={item => {
                  return (
                    <Pressable
                      onPress={() => toggelSelection(item.item)}
                      style={{marginHorizontal: 5, alignItems: 'center'}}>
                      <View style={{height: 40, width: 50, borderRadius: 50}}>
                        <Image
                          source={require('../../assets/image/unknownprofile.jpg')}
                          style={{height: 50, width: 50, borderRadius: 50}}
                        />
                        <View
                          style={{
                            position: 'absolute',
                            bottom: -8,
                            right: 0,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            padding: 3,
                            paddingHorizontal: 4,
                            borderRadius: 50,
                          }}>
                          <FontAwesome
                            name="remove"
                            size={14}
                            color={'white'}
                          />
                        </View>
                      </View>
                      <Text style={{color: colors.text, marginTop: 8}}>
                        {item.item.name}
                      </Text>
                    </Pressable>
                  );
                }}
              />
            </View>
          )}
          <ScrollView style={selectedContact.length >0 ? {height: '80%'}:{height:'92%'}}>
            {allUserContacts &&
              allUserContacts.map((element, index) => {
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
                      width: '100%',
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        toggelSelection(element);
                      }}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                      }}>
                      <Image
                        source={require('../../assets/image/unknownprofile.jpg')}
                        style={{height: 50, width: 50, borderRadius: 50}}
                      />
                      <View style={{marginHorizontal: 15}}>
                        <Text style={{color: colors.text, fontSize: 18}}>
                          {element && element.name}
                        </Text>
                        <Text style={{color: colors.text}}>
                          {element && element.number[0]}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
          </ScrollView>
          {selectedContact.length > 0 && (
            <Pressable
              style={{
                height: 50,
                width: 70,
                borderRadius: 20,
                backgroundColor: 'green',
                position: 'absolute',
                bottom: 20,
                right: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons name={'arrow-forward'} size={26} color={'white'} />
            </Pressable>
          )}
        </>
      )}
    </View>
  );
};

export default ShareContact;
