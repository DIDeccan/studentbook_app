import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Video from 'react-native-video';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { SH, SW } from '../../utils/dimensions';
import ContainerComponent from '../../components/commonComponents/Container';

const TeluguSubject = () => {
  const [activeUnitIndex, setActiveUnitIndex] = useState(null);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(null);
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
              url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
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
  const handleUnitPress = (unitIdx) => {
    setActiveUnitIndex(unitIdx === activeUnitIndex ? null : unitIdx);
    setActiveSubjectIndex(null); // Close any open subjects when switching unit
  };

  const handleSubjectPress = (subjectIdx) => {
    setActiveSubjectIndex(subjectIdx === activeSubjectIndex ? null : subjectIdx);
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
        key={video.url}
        style={[styles.videoCard, isSelected && styles.videoCardSelected]}
        onPress={() => setSelectedVideo({ ...video, unitTitle })}
      >
        <Image
          source={{ uri: video.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCmgkix4DEJoToCFKP-g8ztCYa9bIuxAC3pA&s' }}
          style={styles.thumbnail}
        />
        <View style={styles.cardContent}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <View style={styles.icons}>
            <TouchableOpacity onPress={() => toggleFavorite(video.url)}>
             <FontAwesome
      name={favorites[video.url] ? 'heart' : 'heart-o'} // filled vs outline
      size={20}
      color={favorites[video.url] ? 'red' : 'gray'}
    />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => toggleDownload(video.url)}>
          <FontAwesome
      name="download"
      size={20}
      color={downloads[video.url] ? 'green' : 'gray'}
    />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ContainerComponent>
    <View style={styles.container}>
      {selectedVideo && (
        <View style={styles.videoContainer}>
          <Text style={styles.nowPlaying}>Now Playing: {selectedVideo.unitTitle}</Text>
          <Video
            source={{ uri: selectedVideo.url }}
            style={styles.videoPlayer}
            controls
            resizeMode="contain"
          />
        </View>
      )}
     
     <ScrollView showsVerticalScrollIndicator={false}>
      {courseData.map((unit, unitIdx) => (
        <View key={unit.unitTitle} style={styles.unitBlock}>
          <TouchableOpacity onPress={() => handleUnitPress(unitIdx)}>
            <Text style={styles.unitTitle}>{unit.unitTitle}</Text>
          </TouchableOpacity>

          {activeUnitIndex === unitIdx &&
            unit.subjects.map((subject, subIdx) => (
              <View key={subIdx} style={styles.subjectBlock}>
                <TouchableOpacity onPress={() => handleSubjectPress(subIdx)}>
                  <Text style={styles.subjectTitle}>{subject.subjectTitle}</Text>
                </TouchableOpacity>

                {activeSubjectIndex === subIdx && (
                  <View style={styles.videoList}>
                    {subject.videos.map((video) =>
                      renderVideoCard(video, unit.unitTitle)
                    )}
                  </View>
                )}
              </View>
            ))}
        </View>
      ))}
      </ScrollView>
    </View>
    </ContainerComponent>
  );
};

export default TeluguSubject;

const styles = StyleSheet.create({
  container: {
    flex: 1,
   // backgroundColor: '#f4f6f8',
   // padding: 10,
    //paddingBottom:SH(50)
  },
  videoContainer: {
    backgroundColor: '#000',
   // padding: 10,
    marginBottom: 10,
  },
  nowPlaying: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
    paddingLeft:SW(10)
  },
  videoPlayer: {
    height:SH(200),
    width: '100%',
    borderRadius: 10,
  },
  unitBlock: {
    marginBottom: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    shadowColor: '#ccc',
    shadowOpacity: 0.4,
    shadowRadius: 5,
    //paddingBottom:SH(50)
  },
  unitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingBottom: 5,
  },
  subjectBlock: {
    marginTop: 8,
    paddingLeft: 10,
  },
  subjectTitle: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
    marginBottom: 6,
  },
  videoList: {
    paddingLeft: 10,
  },
  videoCard: {
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  videoCardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#e1f5fe',
  },
  thumbnail: {
    width: '100%',
    height: 120,
  },
  cardContent: {
    padding: 10,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 5,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
