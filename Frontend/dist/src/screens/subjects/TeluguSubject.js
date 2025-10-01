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
  Platform,
  Modal,
  ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import ContainerComponent from '../../components/commonComponents/Container';
import { darkColors, lightColors } from '../../utils/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { SF, SW } from '../../utils/dimensions';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subjectVideosApi, trackingVideoApi } from '../../redux/reducer/demopagereduce';

const { width, height } = Dimensions.get('window');

const CoursePlayerScreen = (props) => {
  const themeMode = useSelector((state) => state.theme.theme);
  let colors = (themeMode === 'dark') ? darkColors : lightColors;
  const styles = themedStyles(colors);
  const [activeChapter, setActiveChapter] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [videoProgress, setVideoProgress] = useState({});
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState({});
  const [fullScreenVideo, setFullScreenVideo] = useState(null);
  const { loading } = useSelector((state) => state.demoData);
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const SubjectsVideosList = useSelector((state) => state.demoData.subjectVideosData);

  const subjectId = props?.route?.params?.item?.id || null;
  const [watchedVideos, setWatchedVideos] = useState([]);
  const [watchProgress, setWatchProgress] = useState({});

  useEffect(() => {
    const fetchDashboard = async () => {
      let storedId = await AsyncStorage.getItem('studentId');
      let classid = await AsyncStorage.getItem('classId');
      const studentId = storedId ? JSON.parse(storedId) : null;
      const classId = classid ? JSON.parse(classid) : null;

      if (studentId && classId) {
        await dispatch(subjectVideosApi({ student_id: studentId, class_id: classId, subject_id: subjectId }));
      } else {
        console.warn("Missing studentId or classId in AsyncStorage");
      }
    };

    if (isFocused) {
      fetchDashboard();
    }
  }, [isFocused, dispatch, subjectId]);

  const dummyThumbnail = "https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg";

  const safeChaptersArray = Array.isArray(SubjectsVideosList)
    ? SubjectsVideosList
    : Array.isArray(SubjectsVideosList?.data)
      ? SubjectsVideosList.data
      : [];

  const parseDurationToSeconds = (dur) => {
    if (!dur) return 0;
    const parts = String(dur).split(':').map(p => parseInt(p, 10) || 0);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  };

  const courseData = safeChaptersArray.map((chapter) => ({
    chapterTitle: chapter.chapter_name,
    chapterNumber: chapter.chapter_number,
    videos: Array.isArray(chapter.subchapters) ? chapter.subchapters.map((video) => ({
      id: String(video.id),
      title: `${video.subchapter} ${video.video_name}`,
      description: "Watch and learn this lesson.",
      url: video.video_url,
      duration: video.video_duration || "0:00",
      durationSeconds: parseDurationToSeconds(video.video_duration),
      thumbnail: video.image || dummyThumbnail,
      watchedDurationSeconds: parseDurationToSeconds(video.watched_duration || '0:00'),
      is_favourate: !!video.is_favourate,
      percentage_completed: video.percentage_completed || "0"
    })) : []
  }));

  useEffect(() => {
    if (courseData.length > 0 && courseData[0].videos.length > 0) {
      const firstVideo = courseData[0].videos[0];
      setSelectedVideo({
        ...firstVideo,
        chapterTitle: courseData[0].chapterTitle
      });

      const initialExpanded = {};
      courseData.forEach((_, index) => {
        initialExpanded[index] = index === 0;
      });
      setExpandedChapters(initialExpanded);
      setActiveChapter(0);
    }
  }, [JSON.stringify(courseData)]);

  const handleVideoSelect = (video, chapterIndex) => {
    // If clicking the same video that's currently playing, toggle play/pause
    if (selectedVideo && selectedVideo.id === video.id) {
      togglePlayPause();
      return;
    }
    
    // If clicking a different video, load and play it
    setSelectedVideo({ ...video, chapterTitle: courseData[chapterIndex].chapterTitle });
    setActiveChapter(chapterIndex);

    const lastTime = watchProgress[video.id] || video.watchedDurationSeconds || 0;
    setTimeout(() => {
      if (videoRef.current?.seek && lastTime > 0) {
        videoRef.current.seek(lastTime);
      }
    }, 300);

    setIsPlaying(true);
    setShowControls(true);
    resetControlsTimeout();
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
    setShowControls(true);
    resetControlsTimeout();
  };

  const toggleFavorite = (videoId) => {
    setFavorites(prev => ({
      ...prev,
      [videoId]: !prev[videoId]
    }));
  };

  const toggleChapter = (chapterIndex) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex]
    }));
  };

  const onSlidingStart = () => {
    setIsPlaying(false);
    setShowControls(true);
    resetControlsTimeout();
  };

  const onSlidingComplete = (value) => {
    const seekTime = (value * duration) || 0;
    if (videoRef.current?.seek) {
      videoRef.current.seek(seekTime);
    }
    setIsPlaying(true);
    setShowControls(true);
    resetControlsTimeout();
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVideoEnd = (videoId) => {
    if (!watchedVideos.includes(videoId)) {
      setWatchedVideos((prev) => [...prev, videoId]);
    }
    setWatchProgress(prev => {
      const allVideos = courseData.flatMap(c => c.videos || []);
      const vid = allVideos.find(v => v.id === videoId);
      const full = vid ? vid.durationSeconds : prev[videoId] || 0;
      return { ...prev, [videoId]: full };
    });
  };

  const handleVideoTouch = () => {
    setShowControls(prev => !prev);
    resetControlsTimeout();
  };

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    if (isPlaying && showControls) {
      resetControlsTimeout();
    }
  }, [isPlaying, showControls]);

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const lastSentRef = useRef(0);
  const trackingTimeoutRef = useRef(null);

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
    setDuration(data.seekableDuration || data.playableDuration || duration);

    if (!selectedVideo) return;

    setWatchProgress(prev => ({
      ...prev,
      [selectedVideo.id]: data.currentTime
    }));

    const currentSecond = Math.floor(data.currentTime);

    if (currentSecond - lastSentRef.current >= 2) {
      lastSentRef.current = currentSecond;
      scheduleTrackingApi(currentSecond);
    }
  };

  const scheduleTrackingApi = (seconds) => {
    if (trackingTimeoutRef.current) return;

    trackingTimeoutRef.current = setTimeout(async () => {
      trackingTimeoutRef.current = null;

      const storedId = await AsyncStorage.getItem('studentId');
      const classid = await AsyncStorage.getItem('classId');
      const studentId = storedId ? JSON.parse(storedId) : null;
      const classId = classid ? JSON.parse(classid) : null;

      if (studentId && classId && selectedVideo) {
        dispatch(trackingVideoApi({
          student_id: studentId,
          class_id: classId,
          subchapter_id: selectedVideo.id,
          watched_seconds: seconds,
        }))
          .unwrap()
          .catch(err => console.log('Tracking Error:', err));
      }
    }, 0);
  };

  const openFullScreen = () => {
    if (!fullScreenVideo) setFullScreenVideo(selectedVideo);
  };

  const closeFullScreen = () => setFullScreenVideo(null);

  const navigateToZoomScreen = () => {
    props.navigation.navigate('VideoZoomScreen', {
      video: selectedVideo,
      currentTime: currentTime,
      isPlaying: isPlaying
    });
  };

  const renderVideoItem = (video, chapterIndex, isSelected) => {
    const apiPct = video.percentage_completed || 0;
    const localSecs = watchProgress[video.id] || video.watchedDurationSeconds || 0;
    const pct = video.durationSeconds ? Math.min((localSecs / video.durationSeconds) * 100, 100) : apiPct;
    const finalPct = Math.max(apiPct, pct);
    const isFavorite = favorites[video.id] || video.is_favourate;

    // Check if this video is the currently selected and playing one
    const isCurrentlyPlaying = isSelected && selectedVideo && selectedVideo.id === video.id;

    return (
      <TouchableOpacity
        key={video.id}
        style={[styles.videoCard, isSelected && styles.selectedVideoCard]}
        onPress={() => handleVideoSelect(video, chapterIndex)}
      >
        <View style={styles.videoCardContent}>
          <View style={styles.thumbnailContainer}>
            <Image source={{ uri: video.thumbnail }} style={styles.thumbnail} />
            
            {/* Play/Pause overlay for thumbnail */}
            <TouchableOpacity
              style={styles.playIconOverlay}
              onPress={() => handleVideoSelect(video, chapterIndex)}
            >
              <Ionicons 
                name={isCurrentlyPlaying && isPlaying ? 'pause-circle' : 'play-circle'} 
                size={36} 
                color="white" 
              />
            </TouchableOpacity>

            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{video.duration}</Text>
            </View>
            
            {finalPct > 0 && (
              <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${finalPct}%` }]} />
              </View>
            )}
          </View>

          <View style={styles.videoInfo}>
            <View style={styles.videoHeader}>
              <Text style={[styles.videoTitle, finalPct >= 100 && styles.completedVideo]}>
                {video.title}
                {isCurrentlyPlaying && isPlaying && " ▶"}
              </Text>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(video.id)}
              >
                <Ionicons
                  name={isFavorite ? "heart" : "heart-outline"}
                  size={20}
                  color={isFavorite ? "#FF6B6B" : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.videoDescription} numberOfLines={2}>
              {video.description}
            </Text>
            <View style={styles.progressIndicator}>
              <View style={styles.progressBackground}>
                <View
                  style={[styles.progressFill, { width: `${finalPct}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{Math.round(finalPct)}% watched</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ContainerComponent>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Course Videos</Text>
          <View style={styles.placeholder} />
        </View>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading videos...</Text>
          </View>
        ) : (
          <View style={styles.content}>
            {selectedVideo && (
              <View style={styles.videoContainer}>
                <TouchableOpacity 
                  style={styles.videoWrapper}
                  onPress={handleVideoTouch}
                  activeOpacity={1}
                >
                  <Video
                    ref={videoRef}
                    source={{ uri: selectedVideo.url }}
                    style={styles.videoPlayer}
                    paused={!isPlaying}
                    resizeMode="contain"
                    onProgress={onProgress}
                    onLoad={(data) => {
                      setDuration(data?.duration || selectedVideo.durationSeconds || 0);
                      const lastTime = watchProgress[selectedVideo.id] || 0;
                      if (lastTime > 0 && videoRef.current?.seek) {
                        videoRef.current.seek(lastTime);
                      }
                      resetControlsTimeout();
                    }}
                    onEnd={() => handleVideoEnd(selectedVideo.id)}
                  />
                  
                  {/* Main Play/Pause Overlay - Shows when controls are visible OR video is paused */}
                  {(showControls || !isPlaying) && (
                    <TouchableOpacity 
                      style={styles.playPauseOverlay}
                      onPress={togglePlayPause}
                    >
                      <Ionicons 
                        name={isPlaying ? 'pause-circle' : 'play-circle'} 
                        size={64} 
                        color="rgba(255,255,255,0.9)" 
                      />
                    </TouchableOpacity>
                  )}
                  
                  {/* Main Controls Container - Similar to Modal */}
                  <View style={[
                    styles.mainControlsContainer, 
                    showControls ? styles.controlsVisible : styles.controlsHidden
                  ]}>
             

                    {/* Bottom Controls */}
                    <View style={styles.bottomControlsMain}>
                      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={{flexDirection:'row'}}>
                        <Text style={styles.timeText}>{formatTime(currentTime)} /</Text>
                        <Text style={{color:'white'}}>{formatTime(duration)}</Text>
                        </View>
                 
                         <TouchableOpacity style={{}} onPress={openFullScreen}>
                        <Ionicons name="expand" size={24} color="white" />
                      </TouchableOpacity>
                      </View>
                     
                    </View>
                  </View>
                      <Slider
                          style={styles.sliderMain}
                          minimumValue={0}
                          maximumValue={1}
                          value={duration && currentTime ? currentTime / duration : 0}
                          onSlidingStart={onSlidingStart}
                          onSlidingComplete={onSlidingComplete}
                          minimumTrackTintColor="#961717ff"
                          maximumTrackTintColor="rgba(255,255,255,0.5)"
                          thumbTintColor="#262020ff"
                        />
                </TouchableOpacity>

                <View style={styles.videoDetails}>
                  <Text style={styles.chapterTag}>{selectedVideo.chapterTitle}</Text>
                  <Text style={styles.videoTitleMain}>{selectedVideo.title}</Text>
                  <Text style={styles.videoDescriptionMain}>{selectedVideo.description}</Text>
                </View>
              </View>
            )}

            <ScrollView style={styles.chaptersContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionTitle}>Course Content</Text>

              {courseData.map((chapter, chapterIndex) => (
                <View key={chapterIndex} style={styles.chapterCard}>
                  <TouchableOpacity
                    style={styles.chapterHeader}
                    onPress={() => toggleChapter(chapterIndex)}
                  >
                    <View style={styles.chapterInfo}>
                      <View style={styles.chapterNumber}>
                        <Text style={styles.chapterNumberText}>{chapter.chapterNumber}</Text>
                      </View>
                      <View style={styles.chapterTextContainer}>
                        <Text style={styles.chapterTitle}>{chapter.chapterTitle}</Text>
                        <Text style={styles.videoCount}>
                          {chapter.videos.length} videos
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={expandedChapters[chapterIndex] ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={colors.text}
                    />
                  </TouchableOpacity>

                  {expandedChapters[chapterIndex] && (
                    <View style={styles.videosList}>
                      {Array.isArray(chapter.videos) && chapter.videos.map((video) =>
                        renderVideoItem(video, chapterIndex, selectedVideo?.id === video.id)
                      )}
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </SafeAreaView>

      {fullScreenVideo && (
        <Modal
          visible
          supportedOrientations={['portrait', 'landscape']}
          animationType="fade"
          transparent={false}
        >
          <View style={styles.fullScreenContainer}>
            <TouchableOpacity
              style={styles.fullScreenVideoTouchable}
              onPress={handleVideoTouch}
              activeOpacity={1}
            >
              <Video
                ref={videoRef}
                source={{ uri: fullScreenVideo?.url }}
                style={styles.fullScreenVideo}
                resizeMode="contain"
                paused={!isPlaying}
                onProgress={({ currentTime }) => {
                  setCurrentTime(currentTime);
                  setWatchProgress((prev) => ({
                    ...prev,
                    [fullScreenVideo.id]: currentTime,
                  }));
                }}
                onLoad={(data) => {
                  const pos = watchProgress[fullScreenVideo.id] || 0;
                  setDuration(data?.duration || fullScreenVideo.durationSeconds || 0);
                  if (pos > 0) {
                    videoRef.current?.seek(pos);
                  }
                }}
                onEnd={() => handleVideoEnd(fullScreenVideo.id)}
              />

              {/* Full Screen Play/Pause Overlay */}
              {(showControls || !isPlaying) && (
                <TouchableOpacity
                  style={styles.fullScreenPlayOverlay}
                  onPress={togglePlayPause}
                >
                  <Ionicons
                    name={isPlaying ? 'pause-circle' : 'play-circle'}
                    size={80}
                    color="rgba(255,255,255,0.9)"
                  />
                </TouchableOpacity>
              )}

              {/* Full Screen Controls - Same structure as main video */}
              <View style={[styles.fullScreenControls, showControls ? styles.controlsVisible : styles.controlsHidden]}>
                <TouchableOpacity style={styles.closeButton} onPress={closeFullScreen}>
                  <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>

                <View style={styles.fullScreenProgressContainer}>
                  <Text style={styles.fullScreenTimeText}>{formatTime(currentTime)}</Text>
                  <Slider
                    style={styles.fullScreenSlider}
                    minimumValue={0}
                    maximumValue={1}
                    value={duration ? currentTime / duration : 0}
                    onSlidingStart={() => setIsPlaying(false)}
                    onSlidingComplete={(val) => {
                      const seekTime = val * duration;
                      if (videoRef.current?.seek) {
                        videoRef.current.seek(seekTime);
                      }
                      setIsPlaying(true);
                    }}
                    minimumTrackTintColor="#FFFFFF"
                    maximumTrackTintColor="rgba(255,255,255,0.5)"
                    thumbTintColor="#FFFFFF"
                  />
                  <Text style={styles.fullScreenTimeText}>{formatTime(duration)}</Text>

               
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </ContainerComponent>
  );
};

const themedStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  videoWrapper: {
    position: 'relative',
    backgroundColor: '#000',
    height: 220,
  },
  videoPlayer: {
    height: '100%',
    width: '100%',
  },
  playPauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  // Main Controls Container - Similar to Modal
  mainControlsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  controlsVisible: {
    opacity: 1,
  },
  controlsHidden: {
    opacity: 0,
  },
  topControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  backButtonControl: {
    padding: 8,
  },
  videoTitleControl: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  zoomButtonControl: {
    padding: 8,
  },
  bottomControlsMain: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
    paddingVertical: 1,
  },
  progressContainerMain: {
    flexDirection: 'row',
    alignItems: 'center',
    //marginBottom: 1,
  },
  sliderMain: {
    flex: 1,
    height: 40,
    marginHorizontal: 12,
    zIndex:1
  },
  timeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'center',
  },
  controlButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    padding: 12,
    marginHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: SF(18),
    fontWeight: 'bold',
    color: colors.text,
  },
  placeholder: {
    width: 32,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
  },
  content: {
    flex: 1,
   // backgroundColor: colors.background,
  },
  videoContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  //  borderWidth: 1,
    //borderColor: colors.border,
  },
  videoDetails: {
    padding: 16,
    backgroundColor: colors.background,
  },
  chapterTag: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  videoTitleMain: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  videoDescriptionMain: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  chaptersContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    marginTop: 8,
  },
  chapterCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chapterNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chapterNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  chapterTextContainer: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  videoCount: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  videosList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  videoCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedVideoCard: {
    backgroundColor: colors.primary + '15',
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
  },
  videoCardContent: {
    flexDirection: 'row',
    padding: 12,
  },
  thumbnailContainer: {
    position: 'relative',
    width: 100,
    height: 70,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
  },
  thumbnail: {
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
    bottom: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  durationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FF6B6B',
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  videoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  completedVideo: {
    color: '#4CAF50',
  },
  favoriteButton: {
    padding: 4,
  },
  videoDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBackground: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    color: colors.textSecondary,
    minWidth: 60,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullScreenVideoTouchable: {
    flex: 1,
    justifyContent: 'center',
  },
  fullScreenVideo: {
    width: '100%',
    height: '100%',
  },
  fullScreenPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  fullScreenProgressContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  fullScreenSlider: {
    flex: 1,
    height: 40,
    marginHorizontal: 12,
  },
  fullScreenTimeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'center',
  },
});

export default CoursePlayerScreen;