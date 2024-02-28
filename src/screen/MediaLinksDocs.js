import React, {useEffect, useState} from 'react';
import Header from '../component/Header';
import {Pressable, View, Text, ScrollView, Image} from 'react-native';
import {getFriendsProfileInfo} from '../component/AllFunctions';
import {Day} from 'react-native-gifted-chat';

const MediaLinksDocs = props => {
  const [data, setMediaData] = useState();
  const [allDocs, setAllDocs] = useState();
  const [visiblePage, setVisiblePage] = useState('media');
  useEffect(() => {
    getFriendsProfileInfo({
      friendsId: props?.route?.params?.friendsData?.userid,
      setAllMedia: setMediaData,
      setAllDocs: setAllDocs,
    });
  }, []);
  const filteredMediaFile = data?.map(item => {
    return {...item, uri: item.image};
  });

  return (
    <View>
      <Header title={props?.route?.params?.friendsData?.name} />
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            height: 50,
          }}>
          <Pressable
            onPress={() => setVisiblePage('media')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
            }}>
            <Text
              style={[
                visiblePage === 'media'
                  ? {color: 'black', fontWeight: 'bold'}
                  : {color: 'black'},
              ]}>
              Media
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setVisiblePage('docs')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '50%',
            }}>
            <Text
              style={[
                visiblePage === 'docs'
                  ? {color: 'black', fontWeight: 'bold'}
                  : {color: 'black'},
              ]}>
              Docs
            </Text>
          </Pressable>
        </View>
        <View>
          <ScrollView style={{height: '88%', flexDirection: 'column'}}>
            {visiblePage === 'media' ? (
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {data?.length > 0 ? (
                  data?.map((item, index) => {
                    return (
                      <>
                        <Day
                          currentMessage={item}
                          previousMessage={data[index - 1]}
                          containerStyle={{
                            width: '100%',
                            height: 35,
                            alignItems: 'flex-start',
                            backgroundColor: '#EEEDEB',
                          }}
                          wrapperStyle={{paddingHorizontal: 10}}
                        />
                        <View
                          key={index}
                          style={{
                            margin: 2,
                          }}>
                          <Pressable
                            onPress={() =>
                              props.navigation.navigate('MediaPage', {
                                imageIndex: index,
                                data: filteredMediaFile,
                                friendData: props?.route?.params?.friendsData,
                              })
                            }
                            style={{
                              // height: 105,
                              // width: 105,
                              borderRadius: 5,
                            }}>
                            <Image
                              style={{height: 115, width: 115}}
                              source={{uri: item?.image}}
                            />
                          </Pressable>
                        </View>
                      </>
                    );
                  })
                ) : (
                  <View>
                    <Text style={{color: 'black', margin: 15, fontSize: 18}}>
                      No media found
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <View>
                {allDocs?.length > 0 ? (
                  allDocs.map((item, index) => {
                    const filePath = item?.fileName;
                    var fileType = '';
                    var name = '';
                    if (filePath !== undefined) {
                      name = filePath.split('/').pop();
                      fileType = filePath.split('.').pop();
                    }
                    const fileSize =
                      Math.ceil(item.fileSize / 1024) > 1024
                        ? Math.ceil((item.fileSize / (1024 * 1024)) * 10) / 10 +
                          ' MB'
                        : Math.ceil(item.fileSize / 1024) + ' KB';
                    return (
                      <>
                        <Day
                          currentMessage={item}
                          previousMessage={allDocs[index - 1]}
                          containerStyle={{
                            width: '100%',
                            height: 35,
                            alignItems: 'flex-start',
                            backgroundColor: '#EEEDEB',
                          }}
                          wrapperStyle={{paddingHorizontal: 10}}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            width: '83%',
                            padding: 10,
                          }}>
                          <Image
                            source={
                              fileType === 'pdf'
                                ? require('../../assets/image/pdf.png')
                                : fileType === 'jpg'
                                ? require('../../assets/image/jpg.png')
                                : require('../../assets/image/unknown.png')
                            }
                            style={{height: 40, width: 40, margin: 3}}
                          />
                          <View>
                            <Text
                              lineBreakMode="clip"
                              numberOfLines={1}
                              style={{
                                color: 'black',
                                marginTop: 8,
                                fontSize: 18,
                                lineHeight: 20,
                                marginLeft: 5,
                                marginRight: 5,
                                fontWeight: 'bold',
                              }}>
                              {name.replace('%20', '').replace(' ', '')}
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '100%',
                              }}>
                              <Text
                                style={{
                                  color: 'grey',
                                  marginTop: 8,
                                  fontSize: 14,
                                  lineHeight: 20,
                                  marginLeft: 5,
                                  marginRight: 5,
                                  fontWeight: 'bold',
                                }}>
                                {fileSize}
                              </Text>
                              <Text
                                style={{
                                  color: 'grey',
                                  marginTop: 8,
                                  fontSize: 14,
                                  lineHeight: 20,
                                  marginLeft: 5,
                                  marginRight: 5,
                                  fontWeight: 'bold',
                                }}>
                                {fileType.toUpperCase()}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </>
                    );
                  })
                ) : (
                  <View>
                    <Text style={{color: 'black', margin: 15, fontSize: 18}}>
                      No document found
                    </Text>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default MediaLinksDocs;
