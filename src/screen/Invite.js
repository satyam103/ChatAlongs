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
import {getAllData} from '../component/AllFunctions';
import {useTheme} from '@react-navigation/native';

const Invite = props => {
  const [allUserData, setAllUserData] = useState();
  const [nonUserContacts, setNonUserContacts] = useState();
  const [loading, setLoading] = useState();

  const {colors} = useTheme();
  useEffect(() => {
    getAllData(setAllUserData);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(true);
      fetchData();
      setLoading(false);
    }, 1000);
  },[nonUserContacts,allUserData]);
  const fetchData = () => {
    Contact.getAll().then(contacts => {
      const contactData =
        contacts &&
        contacts.map(values => {
          let number = '';
          for (const i of values.phoneNumbers[0].number) {
            if (i !== '(' && i != ')' && i != ' ' && i != '-') {
              number += i;
            }
          }
          return {number, name: values.displayName};
        });
      const newData = allUserData.map((values, index) => {
        return values.data().mobile;
      });
      const filteredData = contactData.filter(values => {
        const present = newData.find(value => {
          return value === values.number && value;
        });
        return present === undefined && values.number;
      });
      setNonUserContacts(filteredData);
    });
  };
  return (
    <View>
      <Header title={'Invite a friend'} />
      <ScrollView>
        {loading && (
          <View style={{flex: 1, top: 20}}>
            <ActivityIndicator color={colors.text} />
          </View>
        )}
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
                  <Text style={{color: '#16FF00', fontSize: 20}}>+ Invite</Text>
                </Pressable>
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default Invite;
