import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

const HalfWatchedVideos = () => {
  // Sample data for half-watched videos
  const halfWatchedVideos = [
    {
      id: '1',
      title: 'The Dark Knight',
      thumbnail: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3',
      progress: 0.52,
      duration: '2h 32m'
    },
    {
      id: '2',
      title: 'Inception',
      thumbnail: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?ixlib=rb-4.0.3',
      progress: 0.48,
      duration: '2h 28m'
    },
    {
      id: '3',
      title: 'Interstellar',
      thumbnail: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?ixlib=rb-4.0.3',
      progress: 0.61,
      duration: '2h 49m'
    },
    {
      id: '4',
      title: 'The Matrix',
      thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?ixlib=rb-4.0.3',
      progress: 0.55,
      duration: '2h 16m'
    },
    {
      id: '5',
      title: 'Avengers: Endgame',
      thumbnail: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?ixlib=rb-4.0.3',
      progress: 0.42,
      duration: '3h 1m'
    },
  ];

  return (
    <View style={styles.container}>
      {/* <Text style={styles.sectionTitle}>Continue Watching</Text> */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {halfWatchedVideos.map(video => (
          <TouchableOpacity key={video.id} style={styles.videoCard}>
            <View style={styles.thumbnailContainer}>
              <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBar, { width: `${video.progress * 100}%` }]} />
              </View>
            </View>
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle} numberOfLines={1}>{video.title}</Text>
              <Text style={styles.videoDuration}>{video.duration} • {Math.round(video.progress * 100)}% watched</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  //  marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 12,
    color: '#fff',
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  videoCard: {
    width: width * 0.50,
    marginHorizontal: 8,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  progressBarBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#e50914',
  },
  videoInfo: {
    padding: 12,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  videoDuration: {
    fontSize: 12,
    color: '#aaa',
  },
});

export default HalfWatchedVideos;