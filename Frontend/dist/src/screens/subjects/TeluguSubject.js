import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  AsyncStorage // or @react-native-async-storage/async-storage
} from 'react-native';
import Video from 'react-native-video';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { SH, SW } from '../../utils/dimensions';
import ContainerComponent from '../../components/commonComponents/Container';

const { width, height } = Dimensions.get('window');

// Key for storing the last watched video
const LAST_WATCHED_VIDEO_KEY = 'lastWatchedVideo';

const TeluguSubject = () => {
  const [activeUnitIndex, setActiveUnitIndex] = useState(null);
  const [activeSubjectIndex, setActiveSubjectIndex] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [downloads, setDownloads] = useState({});
  const [progress, setProgress] = useState(0);
  const videoRef = useRef(null);
  const animationValues = useRef(new Map()).current;

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

  // Load last watched video on component mount
  useEffect(() => {
    loadLastWatchedVideo();
  }, []);

  // Save video progress when it changes
  useEffect(() => {
    if (selectedVideo) {
      saveVideoProgress();
    }
  }, [selectedVideo, progress]);

  const loadLastWatchedVideo = async () => {
    try {
      const savedVideoData = await AsyncStorage.getItem(LAST_WATCHED_VIDEO_KEY);
      if (savedVideoData) {
        const { video, unitTitle, progress: savedProgress } = JSON.parse(savedVideoData);
        
        // Find the video in our course data
        let foundVideo = null;
        let foundUnitTitle = '';
        
        courseData.forEach(unit => {
          unit.subjects.forEach(subject => {
            subject.videos.forEach(v => {
              if (v.url === video.url) {
                foundVideo = v;
                foundUnitTitle = unit.unitTitle;
              }
            });
          });
        });
        
        if (foundVideo) {
          setSelectedVideo({ ...foundVideo, unitTitle: foundUnitTitle });
          setProgress(savedProgress);
        } else {
          // If no saved video found, select the first video of the first lesson
          selectFirstVideo();
        }
      } else {
        // If no saved video, select the first video of the first lesson
        selectFirstVideo();
      }
    } catch (error) {
      console.error('Error loading last watched video:', error);
      selectFirstVideo();
    }
  };

  const selectFirstVideo = () => {
    if (courseData.length > 0 && 
        courseData[0].subjects.length > 0 && 
        courseData[0].subjects[0].videos.length > 0) {
      setSelectedVideo({ 
        ...courseData[0].subjects[0].videos[0], 
        unitTitle: courseData[0].unitTitle 
      });
    }
  };

  const saveVideoProgress = async () => {
    try {
      const videoData = {
        video: selectedVideo,
        unitTitle: selectedVideo.unitTitle,
        progress: progress
      };
      await AsyncStorage.setItem(LAST_WATCHED_VIDEO_KEY, JSON.stringify(videoData));
    } catch (error) {
      console.error('Error saving video progress:', error);
    }
  };

  const handleUnitPress = (unitIdx) => {
    // Initialize animation value if not exists
    if (!animationValues.has(unitIdx)) {
      animationValues.set(unitIdx, new Animated.Value(0));
    }
    
    const willExpand = unitIdx !== activeUnitIndex;
    setActiveUnitIndex(willExpand ? unitIdx : null);
    setActiveSubjectIndex(null);
    
    // Animate the expansion/collapse
    Animated.timing(animationValues.get(unitIdx), {
      toValue: willExpand ? 1 : 0,
      duration: 300,
      useNativeDriver: false // Fixed: useNativeDriver set to false for layout animations
    }).start();
  };

  const handleSubjectPress = (subjectIdx) => {
    // Initialize animation value if not exists
    if (!animationValues.has(`subject-${subjectIdx}`)) {
      animationValues.set(`subject-${subjectIdx}`, new Animated.Value(0));
    }
    
    const willExpand = subjectIdx !== activeSubjectIndex;
    setActiveSubjectIndex(willExpand ? subjectIdx : null);
    
    // Animate the expansion/collapse
    Animated.timing(animationValues.get(`subject-${subjectIdx}`), {
      toValue: willExpand ? 1 : 0,
      duration: 300,
      useNativeDriver: false // Fixed: useNativeDriver set to false
    }).start();
  };

  const toggleFavorite = (url) => {
    setFavorites((prev) => ({ ...prev, [url]: !prev[url] }));
  };

  const toggleDownload = (url) => {
    setDownloads((prev) => ({ ...prev, [url]: !prev[url] }));
    
    // Show a brief animation when downloading (with useNativeDriver: true)
    const downloadAnim = new Animated.Value(0);
    Animated.sequence([
      Animated.timing(downloadAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true // This is okay as it's a separate animation
      }),
      Animated.timing(downloadAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      })
    ]).start();
  };

  const onProgress = (data) => {
    setProgress(data.currentTime / data.seekableDuration);
  };

  const onVideoLoad = (data) => {
    if (progress > 0 && videoRef.current) {
      videoRef.current.seek(data.duration * progress);
    }
  };

  const renderVideoCard = (video, unitTitle) => {
    const isSelected = selectedVideo?.url === video.url;
    return (
      <TouchableOpacity
        key={video.url}
        style={[styles.videoCard, isSelected && styles.videoCardSelected]}
        onPress={() => setSelectedVideo({ ...video, unitTitle })}
      >
        <View style={styles.thumbnailContainer}>
          <Image
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCmgkix4DEJoToCFKP-g8ztCYa9bIuxAC3pA&s' }}
            style={styles.thumbnail}
          />
          <View style={styles.playIconContainer}>
            <MaterialIcons name="play-circle-filled" size={40} color="rgba(255,255,255,0.8)" />
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>10:25</Text>
          </View>
          {isSelected && progress > 0 && (
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <View style={styles.icons}>
            <TouchableOpacity 
              onPress={() => toggleFavorite(video.url)}
              style={styles.iconButton}
            >
              <FontAwesome
                name={favorites[video.url] ? 'heart' : 'heart-o'}
                size={20}
                color={favorites[video.url] ? '#E91E63' : '#666'}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => toggleDownload(video.url)}
              style={styles.iconButton}
            >
              <FontAwesome
                name="download"
                size={20}
                color={downloads[video.url] ? '#4CAF50' : '#666'}
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
            <Text style={styles.nowPlaying}>Now Playing: {selectedVideo.title}</Text>
            <Video
              ref={videoRef}
              source={{ uri: selectedVideo.url }}
              style={styles.videoPlayer}
              controls
              resizeMode="contain"
              onProgress={onProgress}
              onLoad={onVideoLoad}
              paused={false}
            />
            {progress > 0 && (
              <Text style={styles.resumeText}>Resuming from previous position</Text>
            )}
          </View>
        )}
        
        <ScrollView 
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          <Text style={styles.courseTitle}>Programming Course</Text>
          <Text style={styles.courseSubtitle}>Learn programming from basics to advanced</Text>
          
          {courseData.map((unit, unitIdx) => (
            <View key={unit.unitTitle} style={styles.unitBlock}>
              <TouchableOpacity 
                onPress={() => handleUnitPress(unitIdx)}
                style={styles.unitHeader}
              >
                <View style={styles.unitHeaderContent}>
                  <View style={styles.unitIndicator}>
                    <Text style={styles.unitNumber}>Unit {unitIdx + 1}</Text>
                  </View>
                  <Text style={styles.unitTitle}>{unit.unitTitle}</Text>
                </View>
                <MaterialIcons 
                  name={activeUnitIndex === unitIdx ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
                  size={24} 
                  color="#555" 
                />
              </TouchableOpacity>

              {activeUnitIndex === unitIdx && (
                <View style={styles.subjectsContainer}>
                  {unit.subjects.map((subject, subIdx) => (
                    <View key={subIdx} style={styles.subjectBlock}>
                      <TouchableOpacity 
                        onPress={() => handleSubjectPress(subIdx)}
                        style={styles.subjectHeader}
                      >
                        <View style={styles.subjectHeaderContent}>
                          <MaterialIcons name="subject" size={18} color="#2196F3" />
                          <Text style={styles.subjectTitle}>{subject.subjectTitle}</Text>
                        </View>
                        <MaterialIcons 
                          name={activeSubjectIndex === subIdx ? 'expand-less' : 'expand-more'} 
                          size={20} 
                          color="#777" 
                        />
                      </TouchableOpacity>

                      {activeSubjectIndex === subIdx && (
                        <View style={styles.subjectContent}>
                          <Text style={styles.subjectDescription}>{subject.content}</Text>
                          <View style={styles.videoList}>
                            {subject.videos.map((video) =>
                              renderVideoCard(video, unit.unitTitle)
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
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
    backgroundColor: '',
  },
  scrollView: {
    paddingHorizontal: 15,
  },
  courseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 5,
  },
  courseSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  videoContainer: {
    backgroundColor: '#000',
    paddingVertical: 10,
  },
  nowPlaying: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 5,
    paddingLeft: 15,
  },
  resumeText: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 5,
    fontSize: 12,
  },
  videoPlayer: {
    height: SH(200),
    width: '100%',
  },
  unitBlock: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  unitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f7ff',
  },
  unitHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  unitIndicator: {
    backgroundColor: '#2196F3',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 12,
  },
  unitNumber: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  subjectsContainer: {
    paddingHorizontal: 10,
  },
  subjectBlock: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  subjectHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  subjectTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
    marginLeft: 10,
    flex: 1,
  },
  subjectContent: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  subjectDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  videoList: {
    marginTop: 5,
  },
  videoCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  videoCardSelected: {
    borderColor: '#2196F3',
    backgroundColor: '#f0f7ff',
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 150,
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  cardContent: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  icons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 5,
  },
});