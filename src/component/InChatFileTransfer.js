import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
const InChatFileTransfer = ({filePath}) => {
  var fileType = '';
  var name = '';
  if (filePath !== undefined) {
    name = filePath.split('/').pop();
    fileType = filePath.split('.').pop();
  }
  return (
    <View style={styles.container}>
      <View style={styles.frame}>
        <Image
          source={
            fileType === 'pdf'
              ? require('../../assets/image/pdf.png')
              : require('../../assets/image/unknown.png')
          }
          style={{height: 40, width: 40, margin: 3}}
        />
        <View style={{maxWidth:'70%'}}>
          <Text lineBreakMode='clip' numberOfLines={1} style={styles.text}>
            {name.replace('%20', '').replace(' ', '')}
          </Text>
          <Text style={styles.textType}>{fileType.toUpperCase()}</Text>
        </View>
        <View
          style={{
            padding: 5,
            backgroundColor: 'grey',
            borderRadius: 50,
            height: 40,
            width: 40,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FontAwesome6 name="download" color={'white'} size={18} />
        </View>
      </View>
    </View>
  );
};
export default InChatFileTransfer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
    borderRadius: 15,
    padding: 5,
  },
  text: {
    color: 'white',
    marginTop: 8,
    fontSize: 16,
    lineHeight: 20,
    marginLeft: 5,
    marginRight: 5,
  },
  textType: {
    color: 'white',
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  frame: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    flexDirection: 'row',
    borderRadius: 10,
    padding: 3,
    marginTop: -4,
    alignItems:'center',
  },
});
