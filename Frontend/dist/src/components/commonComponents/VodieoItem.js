import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // for icons
import { SF, SW } from '../../utils/dimensions';

const VideoItem = ({ video, onPlay, onDownload, onFavorite,isActive }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = () => {
    const favStatus = !isFavorite;
    setIsFavorite(favStatus);
    onFavorite && onFavorite(video, favStatus);
  };

  return (
    <View style={[
        styles.container,
        isActive && { backgroundColor: '#f9c2ff' }, // Pink for active
      ]}>
      <Image
        source={{ uri: video.thumbnail || 'https://via.placeholder.com/150' }}
        style={styles.thumbnail}
      />
      <View style={styles.info}>
        <Text style={styles.title}>{video.title}</Text>
        <View style={styles.buttons}>
          {/* <TouchableOpacity onPress={() => onPlay(video)}>
            <Icon name="play-circle" size={28} color="#007bff" />
          </TouchableOpacity> */}

          <TouchableOpacity onPress={handleFavorite}>
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={26}
              color={isFavorite ? 'red' : 'gray'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDownload(video)}>
            <Icon name="download" size={26} color="#28a745" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  thumbnail: {
    width: 100,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
  info: {
    flex: 1,
    flexDirection:'row',
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: SF(13),
    fontWeight: '600',
    width:SW('50%'),
   borderWidth:1
  },
  buttons: {
    flexDirection: 'row',
  
    //marginTop: 8,
    width: SW(60),
      justifyContent: 'space-between',
    //justifyContent:'center',
    alignItems:'center',
    //borderWidth:1
  },
});

export default VideoItem;
