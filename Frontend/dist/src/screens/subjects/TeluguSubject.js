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
      //console.log(studentId,classId,subjectId,"====su000----")
      if (studentId && classId) {
        await dispatch(subjectVideosApi({ student_id: studentId, class_id: classId, subject_id: subjectId }));
      } else {
        console.warn("Missing studentId or classId in AsyncStorage");
      }
      studentIdRef.current = storedId ? JSON.parse(storedId) : null;
      classIdRef.current = classid ? JSON.parse(classid) : null;
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
    setSelectedVideo({ ...video, chapterTitle: courseData[chapterIndex].chapterTitle });
    setActiveChapter(chapterIndex);

    const lastTime = watchProgress[video.id] || video.watchedDurationSeconds || 0;
    setTimeout(() => {
      if (videoRef.current?.seek && lastTime > 0) {
        videoRef.current.seek(lastTime);
      }
    }, 300);

    setIsPlaying(true);
  };

  const togglePlayPause = () => setIsPlaying(prev => !prev);

  const toggleChapter = (chapterIndex) => {
    setExpandedChapters(prev => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex]
    }));
  };

  const onSlidingStart = () => setIsPlaying(false);

  const onSlidingComplete = (value) => {
    const seekTime = (value * duration) || 0;
    if (videoRef.current?.seek) {
      videoRef.current.seek(seekTime);
    }
    setIsPlaying(true);
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

  const renderVideoItem = (video, chapterIndex, isSelected) => {
    const apiPct = video.percentage_completed || 0;
    const localSecs = watchProgress[video.id] || video.watchedDurationSeconds || 0;
    const pct = video.durationSeconds ? Math.min((localSecs / video.durationSeconds) * 100, 100) : apiPct;
    const finalPct = Math.max(apiPct, pct);

    return (
      <TouchableOpacity
        key={video.id}
        style={[styles.videoItem, isSelected && styles.selectedVideoItem]}
        onPress={() => handleVideoSelect(video, chapterIndex)}
      >
        <View style={styles.videoThumbnailContainer}>
          <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
          <View style={styles.playIconOverlay}>
            {isSelected && isPlaying ? (
              <Ionicons name="pause" size={36} color="white" />
            ) : (
              <Ionicons name="play-circle" size={36} color="white" />
            )}
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{video.duration}</Text>
          </View>
          {finalPct > 0 && (
            <View style={styles.thumbnailProgressContainer}>
              <View style={[styles.thumbnailProgress, { width: `${finalPct}%` }]} />
            </View>
          )}
        </View>
        <View style={styles.videoInfo}>
          <Text style={[styles.videoTitle, finalPct >= 100 && { color: 'red' }]}>{video.title}</Text>
          <Text style={styles.videoDescription} numberOfLines={2}>{video.description}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const openFullScreen = () => {
    if (!fullScreenVideo) setFullScreenVideo(selectedVideo);
  };
  const closeFullScreen = () => setFullScreenVideo(null);

  const onProgress1 = async (data) => {

    setCurrentTime(data.currentTime);
    setDuration(data.seekableDuration || data.playableDuration || duration);

    if (!selectedVideo) return;

    setWatchProgress((prev) => ({ ...prev, [selectedVideo.id]: data.currentTime }));
    console.log("Hiiiii111")
    const lastSent = watchProgress[selectedVideo.id + '_lastSent'] || 0;
    const currentSecond = Math.floor(data.currentTime);
    console.log("Hiiiii222")
    if (currentSecond - lastSent >= 1) {
      setWatchProgress((prev) => ({ ...prev, [selectedVideo.id + '_lastSent']: currentSecond }));
      const storedId = await AsyncStorage.getItem('studentId');
      const classid = await AsyncStorage.getItem('classId');
      const studentId = storedId ? JSON.parse(storedId) : null;
      const classId = classid ? JSON.parse(classid) : null;
          console.log("Hiiiii33")
      console.log(studentId,classId,selectedVideo.id, currentSecond,"=====rume")
      if (studentId && classId) {
        dispatch(
          trackingVideoApi({
            student_id: '255',
            class_id: classId,
            subchapter_id: selectedVideo.id,
            watched_seconds: currentSecond,
          })
        ).unwrap().catch((err) => console.log('Tracking Error:', err));
      }
    }
  };


  const lastSentRef = useRef(0);

const onProgress = (data) => {
  // Always update UI smoothly
  setCurrentTime(data.currentTime);
  setDuration(data.seekableDuration || data.playableDuration || duration);
  if (!selectedVideo) return;

  setWatchProgress(prev => ({
    ...prev,
    [selectedVideo.id]: data.currentTime
  }));

  const currentSecond = Math.floor(data.currentTime);

  // Only update lastSentRef, but no async calls here
  if (currentSecond - lastSentRef.current >= 10) {
    lastSentRef.current = currentSecond;
    scheduleTrackingApi(currentSecond);
  }
};

// Use a ref to prevent multiple pending calls
const trackingTimeoutRef = useRef(null);
const scheduleTrackingApi = (seconds) => {
  if (trackingTimeoutRef.current) return;

  trackingTimeoutRef.current = setTimeout(async () => {
    trackingTimeoutRef.current = null; // allow next call

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
  }, 0); // you can add a slight delay if needed
};


  return (
    <ContainerComponent>
     
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => props.navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Programming Course</Text>
            <View style={styles.placeholder} />
          </View>
        {loading ? (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="green" />
        </View>
          ) : (
          <View style={styles.content}>
            {selectedVideo && (
              <TouchableOpacity style={styles.videoSection1} activeOpacity={1}>
                <View style={styles.videoSection}>
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
                    }}
                    onEnd={() => handleVideoEnd(selectedVideo.id)}
                  />
                  {showControls && (
                    <View style={styles.controlsOverlay}>
                      <TouchableOpacity style={styles.centerPlayButton} onPress={togglePlayPause}>
                        <Ionicons name={isPlaying ? 'pause' : 'play'} size={48} color="white" />
                      </TouchableOpacity>
                      <View style={styles.bottomControls}>
                        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                        <Slider
                          style={styles.progressSlider}
                          minimumValue={0}
                          maximumValue={1}
                          value={(duration && currentTime) ? currentTime / duration : 0}
                          onSlidingStart={onSlidingStart}
                          onSlidingComplete={(val) => {
                            if (!duration) return;
                            const seekTo = val * duration;
                            if (videoRef.current?.seek) {
                              videoRef.current.seek(seekTo);
                            }
                            setIsPlaying(true);
                          }}
                          minimumTrackTintColor="#FF0000"
                          maximumTrackTintColor="#FFFFFF"
                          thumbTintColor="#FF0000"
                        />
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                        <TouchableOpacity style={styles.controlButton} onPress={openFullScreen}>
                          <Ionicons name="expand-outline" size={24} color="white" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
                <View style={styles.videoInfoPanel}>
                  <Text style={styles.currentChapter}>{selectedVideo.chapterTitle}</Text>
                  <Text style={styles.videoTitleLarge}>{selectedVideo.title}</Text>
                  <Text style={styles.videoDescriptionLarge}>{selectedVideo.description}</Text>
                </View>
              </TouchableOpacity>
            )}
            <ScrollView style={styles.chaptersList}>
              {courseData.map((chapter, chapterIndex) => (
                <View key={chapterIndex} style={styles.chapterContainer}>
                  <TouchableOpacity style={styles.chapterHeader} onPress={() => toggleChapter(chapterIndex)}>
                    <View style={styles.chapterNumber}>
                      <Text style={styles.chapterNumberText}>{chapter.chapterNumber}</Text>
                    </View>
                    <Text style={styles.chapterTitle}>{chapter.chapterTitle}</Text>
                    <Ionicons name={expandedChapters[chapterIndex] ? 'chevron-up' : 'chevron-down'} size={20} color="#666" />
                  </TouchableOpacity>
                  {expandedChapters[chapterIndex] && (
                    <View style={styles.videosContainer}>
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

      {/* Close Button */}
      <TouchableOpacity style={styles.closeButton} onPress={closeFullScreen}>
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>

      {/* Play/Pause Button */}
      <TouchableOpacity
        style={styles.fullScreenPlayButton}
        onPress={() => setIsPlaying((prev) => !prev)}
      >
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={50} color="white" />
      </TouchableOpacity>

      {/* Progress Bar */}
      <View style={styles.fullScreenProgressContainer}>
        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
        <Slider
          style={{ flex: 1, marginHorizontal: 10 }}
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
          minimumTrackTintColor="#FF0000"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#FF0000"
        />
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  </Modal>
)}

    </ContainerComponent>
  );
};

const themedStyles = (colors) => StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: SF(18), fontWeight: 'bold', color: colors.text },
  placeholder: { width: 32 },
  content: { flex: 1 },
  videoSection: { backgroundColor: '#000', position: 'relative' },
  videoPlayer: { height: 240, width: '100%' },
  controlsOverlay: { justifyContent: 'space-between' },
  centerPlayButton: { position: 'absolute', left: 0, right: 0, bottom: 100, justifyContent: 'center', alignItems: 'center' },
  bottomControls: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16 },
  progressSlider: { flex: 1, height: 40, marginHorizontal: 10 },
  timeText: { color: 'white', fontSize: 12, width: 40 },
  controlButton: { padding: 8, borderRadius: 20 },
  videoInfoPanel: { paddingHorizontal: SW(17), paddingVertical: SW(10) },
  currentChapter: { fontSize: 14, color: colors.text, marginBottom: 4 },
  videoTitleLarge: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 8 },
  videoDescriptionLarge: { fontSize: 14, color: colors.text, lineHeight: 20 },
  chaptersList: { flex: 1, padding: 16 },
  chapterContainer: { marginBottom: 16, backgroundColor: colors.grey, borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  chapterHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  chapterNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#4361EE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  chapterNumberText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  chapterTitle: { fontSize: 16, fontWeight: '600', color: '#333', flex: 1 },
  videosContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  videoItem: { flexDirection: 'row', padding: 12, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  //selectedVideoItem: { backgroundColor: '#F0F7FF

  selectedVideoItem: { backgroundColor: '#F0F7FF', borderLeftWidth: 4, borderLeftColor: '#4361EE' },
  videoThumbnailContainer: { position: 'relative', width: 120, height: 80, borderRadius: 8, overflow: 'hidden', marginRight: 12 },
  videoThumbnail: { width: '100%', height: '100%' },
  playIconOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  durationBadge: { position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  durationText: { color: 'white', fontSize: 12 },
  thumbnailProgressContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  thumbnailProgress: { height: '100%', backgroundColor: '#FF0000' },
  videoInfo: { flex: 1, justifyContent: 'space-between' },
  videoTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  videoDescription: { fontSize: 12, color: '#666', marginBottom: 8, lineHeight: 16 },
  videoActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  favButton: { padding: 4 },
  chapterTag: { backgroundColor: '#E6F7FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  chapterTagText: { fontSize: 12, color: '#1890FF', fontWeight: '500' },
  fullScreenVideo: { width: '100%', height: '100%' },
  closeButton: { position: 'absolute', top: 40, right: 20, zIndex: 10 },
  fullScreenPlayButton: { position: 'absolute', alignSelf: 'center', zIndex: 10 },
  stopButton: {
  position: 'absolute',
  top: 40,
  left: 20,
  zIndex: 10,
},
  loaderOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.3)", // dim background
  zIndex: 999,
},
fullScreenProgressContainer: {
  position: 'absolute',
  bottom: 40,
  left: 20,
  right: 20,
  flexDirection: 'row',
  alignItems: 'center',
},
fullScreenPlayButton: {
  position: 'absolute',
  alignSelf: 'center',
  top: '45%',
  zIndex: 10,
},
timeText: { color: 'white', fontSize: 14, width: 40, textAlign: 'center' }

});

export default CoursePlayerScreen;
