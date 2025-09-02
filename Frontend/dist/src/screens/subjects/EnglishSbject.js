import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import Video from 'react-native-video'; // If not installed, use expo-av or your player

const EnglishSubject = () => {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [downloads, setDownloads] = useState({});

    const courseData = [
    {
      unitTitle: 'Unit 1: Introduction',
      subjects: [
        {
          subjectTitle: 'Subject 1: Basics of Programming',
          videos: [
            {
              title: 'What is Programming?',
              url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            },
            {
              title: 'First Program',
              url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            },
          ],
          content:
            'This subject introduces the basic concepts of programming languages.',
        },
        {
          subjectTitle: 'Subject 2: Tools Setup',
          videos: [
            {
              title: 'Installing Tools',
              url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            },
          ],
          content: 'Learn how to install the necessary tools for development.',
        },
      ],
    },
    {
      unitTitle: 'Unit 2: JavaScript Fundamentals',
      subjects: [
        {
          subjectTitle: 'Subject 1: Variables & Data Types',
          videos: [
            {
              title: 'Understanding Variables',
              url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            },
            {
              title: 'Data Types in JS',
              url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            },
          ],
          content:
            'Covers different types of variables and data types in JavaScript.',
        },
        {
          subjectTitle: 'Subject 2: Operators',
          videos: [
            {
              title: 'Arithmetic & Logical Operators',
              url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            },
          ],
          content: 'Explains how to use operators effectively in code.',
        },
      ],
    },
    {
      unitTitle: 'Unit 3: Control Flow',
      subjects: [
        {
          subjectTitle: 'Subject 1: Conditional Statements',
          videos: [
            {
              title: 'if/else Statements',
              url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
            },
          ],
          content:
            'Learn to use if, else if, and else statements to control logic.',
        },
        {
          subjectTitle: 'Subject 2: Loops',
          videos: [
            {
              title: 'For & While Loops',
              url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            },
            {
              title: 'Loop Practice',
              url: 'https://www.w3schools.com/html/mov_bbb.mp4',
            },
          ],
          content: 'Understand and practice different types of loops in JS.',
        },
      ],
    },
    {
      unitTitle: 'Unit 4: Functions & Scope',
      subjects: [
        {
          subjectTitle: 'Subject 1: Functions',
          videos: [
            {
              title: 'Function Basics',
              url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
            },
          ],
          content:
            'Covers function declaration, parameters, and return values.',
        },
        {
          subjectTitle: 'Subject 2: Scope and Hoisting',
          videos: [
            {
              title: 'Understanding Scope',
              url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
            },
            {
              title: 'Hoisting Explained',
              url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            },
          ],
          content: 'Explore local/global scope and the concept of hoisting.',
        },
      ],
    },
  ];

  const handleVideoSelect = (video, unitTitle) => {
    setSelectedVideo({ ...video, unitTitle });
  };

  const toggleFavorite = (url) => {
    setFavorites((prev) => ({ ...prev, [url]: !prev[url] }));
  };

  const toggleDownload = (url) => {
    setDownloads((prev) => ({ ...prev, [url]: !prev[url] }));
  };

  const renderVideoCard = (video, unitTitle) => {
    const isSelected = selectedVideo?.url === video.url;
    return (
      <TouchableOpacity
        style={[styles.card, isSelected && styles.cardSelected]}
        onPress={() => handleVideoSelect(video, unitTitle)}>
        <Image source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyG4zwWqbxI8Djn5Gii2jS_v8HR9qQz0jJjg&s' }} style={styles.thumbnail} />
        <View style={styles.cardContent}>
          <Text style={styles.title}>{video.title}</Text>
          <View style={styles.icons}>
            <TouchableOpacity onPress={() => toggleFavorite(video.url)}>
              <Text style={{ color: favorites[video.url] ? 'red' : 'gray' }}>♥</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleDownload(video.url)}>
              <Text style={{ color: downloads[video.url] ? 'green' : 'gray' }}>⬇</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {selectedVideo && (
        <View style={styles.videoContainer}>
          <Text style={styles.unitText}>Now Playing: {selectedVideo.unitTitle}</Text>
          <Video
            source={{ uri: selectedVideo.url }}
            style={styles.videoPlayer}
            controls
            resizeMode="contain"
          />
        </View>
      )}
      <FlatList
        data={courseData}
        keyExtractor={(item) => item.unitTitle}
        renderItem={({ item: unit }) => (
          <View style={styles.unitBlock}>
            <Text style={styles.unitTitle}>{unit.unitTitle}</Text>
            {unit.subjects.map((subject, subIdx) => (
              <View key={subIdx} style={styles.subjectBlock}>
                <Text style={styles.subjectTitle}>{subject.subjectTitle}</Text>
                <FlatList
                  data={subject.videos}
                  keyExtractor={(vid) => vid.url}
                  horizontal
                  renderItem={({ item: video }) => renderVideoCard(video, unit.unitTitle)}
                />
              </View>
            ))}
          </View>
        )}
      />
    </View>
  );
};

export default EnglishSubject;

const styles = StyleSheet.create({
  videoContainer: {
    backgroundColor: '#000',
    padding: 10,
  },
  unitText: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  videoPlayer: {
    height: 200,
    width: '100%',
  },
  unitBlock: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  unitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 5,
  },
  subjectBlock: {
    marginVertical: 5,
  },
  subjectTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginRight: 10,
    width: 180,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#e0f7fa',
  },
  thumbnail: {
    height: 100,
    width: '100%',
  },
  cardContent: {
    padding: 10,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
