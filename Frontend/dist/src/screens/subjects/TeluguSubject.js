import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import Video from 'react-native-video';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import ContainerComponent from '../../components/commonComponents/Container';

const { width, height } = Dimensions.get('window');

const CoursePlayerScreen = (props) => {
  const [activeChapter, setActiveChapter] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});
  
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);

  const courseData = [
    {
      chapterTitle: 'Chapter 1: Introduction to Programming',
      chapterNumber: 1,
      videos: [
        {
          id: '1.1',
          title: '1.1 What is Programming?',
          description: 'Learn the basics of programming and why it is important in today\'s world.',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          duration: '10:25',
          thumbnail: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
        },
        {
          id: '1.2',
          title: '1.2 Programming Languages',
          description: 'Explore different programming languages and their applications.',
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          duration: '15:40',
          thumbnail: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
        },
        {
          id: '1.3',
          title: '1.3 Setting Up Your Environment',
          description: 'Step-by-step guide to setting up your development environment.',
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          duration: '12:15',
          thumbnail: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
        },
        {
          id: '1.4',
          title: '1.4 Your First Program',
          description: 'Write and run your first program in this beginner-friendly tutorial.',
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          duration: '18:30',
          thumbnail: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
        }
      ]
    },
    {
      chapterTitle: 'Chapter 2: JavaScript Fundamentals',
      chapterNumber: 2,
      videos: [
        {
          id: '2.1',
          title: '2.1 Variables and Data Types',
          description: 'Learn how to declare variables and work with different data types in JavaScript.',
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          duration: '14:20',
          thumbnail: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
        },
        {
          id: '2.2',
          title: '2.2 Operators and Expressions',
          description: 'Understand how to use operators and build expressions in your code.',
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
          duration: '16:45',
          thumbnail: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
        }
      ]
    },
    {
      chapterTitle: 'Chapter 3: Control Structures',
      chapterNumber: 3,
      videos: [
        {
          id: '3.1',
          title: '3.1 Conditional Statements',
          description: 'Master if, else if, and switch statements to control program flow.',
          url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
          duration: '13:10',
          thumbnail: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
        },
        {
          id: '3.2',
          title: '3.2 Loops and Iteration',
          description: 'Learn how to use for, while, and do-while loops effectively.',
          url: 'https://www.w3schools.com/html/mov_bbb.mp4',
          duration: '17:25',
          thumbnail: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg'
        }
      ]
    }
  ];

  // Set the first video as default when component mounts
  useEffect(() => {
    if (courseData.length > 0 && courseData[0].videos.length > 0) {
      const firstVideo = courseData[0].videos[0];
      setSelectedVideo({
        ...firstVideo,
        chapterTitle: courseData[0].chapterTitle
      });
      
      // Initialize expanded chapters - first chapter expanded by default
      const initialExpanded = {};
      courseData.forEach((_, index) => {
        initialExpanded[index] = index === 0;
      });
      setExpandedChapters(initialExpanded);
    }
  }, []);

  // Hide controls after 3 seconds of inactivity
  // useEffect(() => {
  //   if (showControls && isPlaying) {
  //     controlsTimeout.current = setTimeout(() => {
  //       setShowControls(false);
  //     }, 3000);
  //   }

  //   return () => {
  //     if (controlsTimeout.current) {
  //       clearTimeout(controlsTimeout.current);
  //     }
  //   };
  // }, [showControls, isPlaying]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleVideoSelect = (video, chapterIndex) => {
    setSelectedVideo({
      ...video,
      chapterTitle: courseData[chapterIndex].chapterTitle
    });
    setActiveChapter(chapterIndex);
    setIsPlaying(true);
   // setShowControls(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    //setShowControls(true);
  };

  const toggleFullScreen = () => {
   setIsFullScreen(!isFullScreen);
   // setShowControls(true);
    
    if (Platform.OS === 'android') {
      StatusBar.setHidden(!isFullScreen);
    }
  };

  const toggleChapter = (chapterIndex) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex]
    }));
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
    setDuration(data.seekableDuration);
    
    // Save progress
    if (selectedVideo) {
      const progress = data.currentTime / data.seekableDuration;
      setVideoProgress(prev => ({
        ...prev,
        [selectedVideo.id]: progress
      }));
    }
  };

  const onSlidingStart = () => {
    setIsPlaying(false);
   // setShowControls(true);
  };

  const onSlidingComplete = (value) => {
    if (videoRef.current) {
      videoRef.current.seek(value * duration);
    }
    setIsPlaying(true);
  //  setShowControls(true);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getProgressForVideo = (videoId) => {
    return videoProgress[videoId] || 0;
  };

  const renderVideoItem = (video, chapterIndex, isSelected) => {
    const progress = getProgressForVideo(video.id);
    
    return (
      <TouchableOpacity
        key={video.id}
        style={[styles.videoItem, isSelected && styles.selectedVideoItem]}
        onPress={() => handleVideoSelect(video, chapterIndex)}
      >
        <View style={styles.videoThumbnailContainer}>
          <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
          <View style={styles.playIconOverlay}>
            {isSelected && isPlaying?  <Ionicons name="pause" size={36} color="white" />: <Ionicons name="play-circle" size={36} color="white" />}
           
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{video.duration}</Text>
          </View>
          
          {/* Progress bar for watched videos */}
          {progress > 0 && (
            <View style={styles.thumbnailProgressContainer}>
              <View 
                style={[
                  styles.thumbnailProgress, 
                  { width: `${progress * 100}%` }
                ]} 
              />
            </View>
          )}
        </View>
        
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{video.title}</Text>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {video.description}
          </Text>
          
          <View style={styles.videoActions}>
            <TouchableOpacity 
              onPress={() => toggleFavorite(video.id)}
              style={styles.favButton}
            >
              <FontAwesome
                name={favorites[video.id] ? 'heart' : 'heart-o'}
                size={20}
                color={favorites[video.id] ? '#E91E63' : '#666'}
              />
            </TouchableOpacity>
            
            <View style={styles.chapterTag}>
              <Text style={styles.chapterTagText}>
                Chapter {courseData[chapterIndex].chapterNumber}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ContainerComponent>
    <SafeAreaView style={[styles.container, isFullScreen && styles.fullScreenContainer]}>
      {/* Header - Hide in fullscreen mode */}
      {!isFullScreen && (
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={()=>{props.navigation.goBack()}}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Programming Course</Text>
          <View style={styles.placeholder} />
        </View>
      )}

      <View style={[styles.content, isFullScreen && styles.fullScreenContent]}>
        {/* Video Player Section */}
        {selectedVideo && (
          <TouchableOpacity 
            style={[styles.videoSection1, isFullScreen && styles.fullScreenVideoSection]}
            activeOpacity={1}
            //onPress={() => setShowControls(!showControls)}
          >
            <View style={styles.videoSection}>
            <Video
              ref={videoRef}
              source={{ uri: selectedVideo.url }}
              style={[
                styles.videoPlayer,
                isFullScreen && styles.fullScreenVideoPlayer
              ]}
              paused={!isPlaying}
              onProgress={onProgress}
              onLoad={(data) => setDuration(data?.duration)}
              resizeMode="contain"
            />  
            {/* Play/Pause button in the center */}
            {/* {!showControls && (
              <TouchableOpacity 
                style={styles.centerPlayButton}
                onPress={togglePlayPause}
              >
                <Ionicons 
                  name={isPlaying ? 'pause' : 'play'} 
                  size={48} 
                  color="white" 
                  style={styles.centerPlayIcon}
                />
              </TouchableOpacity>
            )} */}
            
            {/* Video Controls Overlay */}
            {showControls && (
              <View style={styles.controlsOverlay}>
                {/* Top controls */}
                {/* {isFullScreen && (
                  <View style={styles.topControls}>
                    <TouchableOpacity 
                      style={styles.controlButton}
                      onPress={toggleFullScreen}
                    >
                      <Ionicons 
                        name="contract-outline" 
                        size={24} 
                        color="white" 
                      />
                    </TouchableOpacity>
                  </View>
                )} */}
                
                {/* Center play button */}
                <TouchableOpacity 
                  style={styles.centerPlayButton}
                  onPress={togglePlayPause}
                >
                  <Ionicons 
                    name={isPlaying ? 'pause' : 'play'} 
                    size={48} 
                    color="white" 
                  />
                </TouchableOpacity>
                
                {/* Bottom controls */}
                <View style={styles.bottomControls}>
                  <Text style={styles.timeText}>
                    {formatTime(currentTime)}
                  </Text>
                  
                  <Slider
                    style={styles.progressSlider}
                    minimumValue={0}
                    maximumValue={1}
                    value={currentTime / duration || 0}
                    onSlidingStart={onSlidingStart}
                    onSlidingComplete={onSlidingComplete}
                    minimumTrackTintColor="#FF0000"
                    maximumTrackTintColor="#FFFFFF"
                    thumbTintColor="#FF0000"
                  />
                  
                  <Text style={styles.timeText}>
                    {formatTime(duration)}
                  </Text>
                  
                  {!isFullScreen && (
                    <TouchableOpacity 
                      style={styles.controlButton}
                    //  onPress={toggleFullScreen}
                    >
                      <Ionicons 
                        name="expand-outline" 
                        size={24} 
                        color="white" 
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            
            )}
              </View>
            {!isFullScreen && (
              <View style={styles.videoInfoPanel}>
                <Text style={styles.currentChapter}>{selectedVideo.chapterTitle}</Text>
                <Text style={styles.videoTitleLarge}>{selectedVideo.title}</Text>
                <Text style={styles.videoDescriptionLarge}>
                  {selectedVideo.description}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Chapters and Videos List - Hide in fullscreen mode */}
        {!isFullScreen && (
          <ScrollView style={styles.chaptersList}>
            {courseData.map((chapter, chapterIndex) => (
              <View key={chapterIndex} style={styles.chapterContainer}>
                <TouchableOpacity 
                  style={styles.chapterHeader}
                  onPress={() => toggleChapter(chapterIndex)}
                >
                  <View style={styles.chapterNumber}>
                    <Text style={styles.chapterNumberText}>
                      {chapter.chapterNumber}
                    </Text>
                  </View>
                  <Text style={styles.chapterTitle}>{chapter.chapterTitle}</Text>
                  <Ionicons 
                    name={expandedChapters[chapterIndex] ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color="#666" 
                  />
                </TouchableOpacity>
                
                {expandedChapters[chapterIndex] && (
                  <View style={styles.videosContainer}>
                    {chapter.videos.map((video) => 
                      renderVideoItem(video, chapterIndex, selectedVideo?.id === video.id)
                    )}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#F8F9FA',
  },
  fullScreenContainer: {
    //backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
 //   backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  fullScreenContent: {
    backgroundColor: '#000',
  },
  videoSection: {
    backgroundColor: '#000',
    position: 'relative',
  },
  fullScreenVideoSection: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  videoPlayer: {
    height: 240,
    width: '100%',
  },
  fullScreenVideoPlayer: {
    height: '100%',
    width: '100%',
  },
  controlsOverlay: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    justifyContent: 'space-between',
  //  backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 40 : 16,
  },
  centerPlayButton: {
    position: 'absolute',
   // top: 20,
    left: 0,
    right: 0,
    bottom: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerPlayIcon: {
 //   backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
   // paddingBottom: 1,
  },
  progressSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  timeText: {
    color: 'white',
    fontSize: 12,
    width: 40,
  },
  controlButton: {
    padding: 8,
   // backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  videoInfoPanel: {
    padding: 16,
    //backgroundColor: 'white',
  },
  currentChapter: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  videoTitleLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  videoDescriptionLarge: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  chaptersList: {
    flex: 1,
    padding: 16,
  },
  chapterContainer: {
    marginBottom: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  chapterNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4361EE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chapterNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  videosContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  videoItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedVideoItem: {
    backgroundColor: '#F0F7FF',
    borderLeftWidth: 4,
    borderLeftColor: '#4361EE',
  },
  videoThumbnailContainer: {
    position: 'relative',
    width: 120,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
  },
  playIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
  },
  thumbnailProgressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  thumbnailProgress: {
    height: '100%',
    backgroundColor: '#FF0000',
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    lineHeight: 16,
  },
  videoActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favButton: {
    padding: 4,
  },
  chapterTag: {
    backgroundColor: '#E6F7FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  chapterTagText: {
    fontSize: 12,
    color: '#1890FF',
    fontWeight: '500',
  },
});

export default CoursePlayerScreen;