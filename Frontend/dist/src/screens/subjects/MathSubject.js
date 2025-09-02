import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import ContainerComponent from '../../components/commonComponents/Container';
import { SF, SH, SW } from '../../utils/dimensions';
import Video from 'react-native-video';
import VideoItem from '../../components/commonComponents/VodieoItem';
import { userProfile } from '../../images';
const screenWidth = Dimensions.get('window').width;
const MathSubject = () => {
  const [openUnitIndex, setOpenUnitIndex] = useState(null);
  const [openSubjectIndex, setOpenSubjectIndex] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentUnitIndex, setCurrentUnitIndex] = useState(null);
  const [watchHistory, setWatchHistory] = useState({
    watched: [],
    halfWatched: [],
  });

  const handleUnitPress = index => {
    setOpenUnitIndex(index === openUnitIndex ? null : index);
    setOpenSubjectIndex(null);
  };

  const handleSubjectPress = index => {
    setOpenSubjectIndex(index === openSubjectIndex ? null : index);
  };

  const handleVideoSelect = (video, unitIndex) => {
    setSelectedVideo(video);
    setCurrentUnitIndex(unitIndex);
  };
  const handleProgress = ({ currentTime, playableDuration }) => {
    if (!selectedVideo) return;
    const percent = (currentTime / playableDuration) * 100;
    const id = selectedVideo.id;

    setWatchHistory(prev => {
      const watched = [...prev.watched];
      const halfWatched = [...prev.halfWatched];

      if (percent > 90 && !watched.includes(id)) {
        return {
          watched: [...watched, id],
          halfWatched: halfWatched.filter(v => v !== id),
        };
      }

      if (
        percent > 20 &&
        percent <= 90 &&
        !watched.includes(id) &&
        !halfWatched.includes(id)
      ) {
        return {
          watched,
          halfWatched: [...halfWatched, id],
        };
      }

      return prev;
    });
  };

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

  return (
    <ContainerComponent>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        {selectedVideo && (
          <View>
            <Video
              source={{ uri: selectedVideo.url }}
              style={styles.videoPlayer}
              controls
              resizeMode="contain"
              onProgress={handleProgress}
            />
            <View>
              <Image
                source={userProfile}
                resizeMethod="cover"
                style={{ height: SH(50), width: SW(50), borderRadius: SH(40) }}
              />

              <Text>Intro to React Native</Text>
            </View>
          </View>
        )}

        <Text style={{ fontSize: SF(25) }}>Mathematics</Text>
        <VideoItem
          video={{
            id: 'v1',
            title: 'Intro to React Native ',
            thumbnail: 'https://i3.ytimg.com/vi/0-S5a0eXPoc/maxresdefault.jpg',
          }}
          // onPlay={(video) => console.log('Play:', video.title)}
          onDownload={video => console.log('Download:', video.title)}
          onFavorite={(video, isFav) =>
            console.log(isFav ? 'Favorited' : 'Unfavorited', video.title)
          }
        />

        <ScrollView style={styles.scroll}>
          {courseData.map((unit, unitIndex) => (
            <View
              key={unitIndex}
              style={[
                styles.unitContainer,
                currentUnitIndex === unitIndex && selectedVideo
                  ? styles.activeUnit
                  : null,
              ]}
            >
              <TouchableOpacity
                onPress={() => handleUnitPress(unitIndex)}
                style={styles.unit}
              >
                <Text style={styles.unitText}>{unit.unitTitle}</Text>
              </TouchableOpacity>

              {openUnitIndex === unitIndex &&
                unit.subjects.map((subject, subjectIndex) => (
                  <View key={subjectIndex} style={styles.subjectContainer}>
                    <TouchableOpacity
                      onPress={() => handleSubjectPress(subjectIndex)}
                    >
                      <Text style={styles.subjectText}>
                        {subject.subjectTitle}
                      </Text>
                    </TouchableOpacity>

                    {openSubjectIndex === subjectIndex &&
                      subject.videos.map(video => (
                        <TouchableOpacity
                          key={video.id}
                          onPress={() => handleVideoSelect(video, unitIndex)}
                        >
                          <VideoItem
                            video={{
                              id: 'v1',
                              title: video.title,
                              thumbnail:
                                'https://i3.ytimg.com/vi/0-S5a0eXPoc/maxresdefault.jpg',
                              //isActive={selectedVideo?.id === videoId}
                            }}
                            // onPlay={(video) => console.log('Play:', video.title)}
                            onDownload={video =>
                              console.log('Download:', video.title)
                            }
                            onFavorite={(video, isFav) =>
                              console.log(
                                isFav ? 'Favorited' : 'Unfavorited',
                                video.title,
                              )
                            }
                          />
                          {/* <Text
                          style={[
                            styles.videoText,
                            selectedVideo?.id === video.id && styles.activeVideoText,
                          ]}
                        >
                          🎥 {video.title}
                        </Text> */}
                        </TouchableOpacity>
                      ))}
                  </View>
                ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </ContainerComponent>
  );
};

export default MathSubject;

const styles = StyleSheet.create({
  videoPlayer: {
    width: screenWidth,
    height: 250,
    backgroundColor: '#000',
  },
  scroll: {
    flex: 1,
    //padding: 10,
  },
  unitContainer: {
    marginBottom: 15,
    // backgroundColor: '#f0f0f0',
    borderRadius: 10,
    //padding: 10,
  },
  unit: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    width: SW(340),
  },
  unitText: {
    color: 'white',
    fontWeight: 'bold',
  },
  subjectContainer: {
    // paddingLeft: 15,
    marginTop: 8,
  },
  subjectText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  videoText: {
    //paddingLeft: 15,
    color: '#666',
    fontSize: 14,
    paddingVertical: 3,
  },
  containerStyle: {
    backgroundColor: 'pink',
  },
});
