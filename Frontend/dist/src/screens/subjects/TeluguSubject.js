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
  Modal
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
import { subjectVideosApi } from '../../redux/reducer/demopagereduce';

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
  //const [isFullScreen, setIsFullScreen] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState({});
  //const [fullScreenVideo, setFullScreenVideo] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
const [fullScreenVideo, setFullScreenVideo] = useState(null);

  const { loading } = useSelector((state) => state.demoData);
  const videoRef = useRef(null);
  const controlsTimeout = useRef(null);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  // This selector is the raw API data which may be either:
  // - An array of chapter objects
  // - An object like { message, message_type, data: [ chapters ] }
  const SubjectsVideosList = useSelector((state) => state.demoData.subjectVideosData);

  const subjectId = props?.route?.params?.item?.id || null;
  const [watchedVideos, setWatchedVideos] = useState([]);
  // watchProgress stores seconds watched for each video: { [videoId]: seconds }
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

  // Helper: safely get array of chapters
  const safeChaptersArray = Array.isArray(SubjectsVideosList)
    ? SubjectsVideosList
    : Array.isArray(SubjectsVideosList?.data)
      ? SubjectsVideosList.data
      : [];

  // Helper to parse "0:00:54" or "01:23" -> seconds
  const parseDurationToSeconds = (dur) => {
    if (!dur) return 0;
    const parts = String(dur).split(':').map(p => parseInt(p, 10) || 0);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return parts[0] || 0;
  };

  // Normalize API -> UI courseData (always an array)
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
      is_favourate: !!video.is_favourate
    })) : []
  }));

  // When courseData changes (after API load), set initial selected video & expanded chapters
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
  }, [/* depend on the normalized data */ JSON.stringify(courseData)]); // stringify to detect deep changes

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
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
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

  // On regular player progress: store seconds in watchProgress (not fraction)
  // const onProgress = (data) => {
  //   setCurrentTime(data.currentTime);
  //   setDuration(data.seekableDuration || data.playableDuration || duration);

  //   if (selectedVideo) {
  //     setWatchProgress(prev => ({
  //       ...prev,
  //       [selectedVideo.id]: data.currentTime
  //     }));
  //     // also store fraction for legacy places if you want
  //     setVideoProgress(prev => ({
  //       ...prev,
  //       [selectedVideo.id]: (selectedVideo.durationSeconds ? data.currentTime / selectedVideo.durationSeconds : 0)
  //     }));
  //   }
  // };

  const onSlidingStart = () => {
    setIsPlaying(false);
  };

  const onSlidingComplete = (value) => {
    const seekTime = (value * duration) || 0;
    if (videoRef.current && typeof videoRef.current.seek === 'function') {
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

  const getProgressForVideo = (videoId) => {
    const secs = watchProgress[videoId] || 0;
    // find the video duration
    const allVideos = courseData.flatMap(c => c.videos || []);
    const vid = allVideos.find(v => v.id === videoId);
    if (!vid || !vid.durationSeconds) return 0;
    return Math.min(secs / vid.durationSeconds, 1);
  };

  const handleVideoEnd = (videoId) => {
    if (!watchedVideos.includes(videoId)) {
      setWatchedVideos((prev) => [...prev, videoId]);
    }
    // mark full progress
    setWatchProgress(prev => {
      const allVideos = courseData.flatMap(c => c.videos || []);
      const vid = allVideos.find(v => v.id === videoId);
      const full = vid ? vid.durationSeconds : prev[videoId] || 0;
      return { ...prev, [videoId]: full };
    });
  };

  const renderVideoItem = (video, chapterIndex, isSelected) => {
    const progressFraction = getProgressForVideo(video.id);
    const pct = Math.min(Number.isFinite(progressFraction) ? progressFraction * 100 : 0, 100);

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

          {pct > 0 && (
            <View style={styles.thumbnailProgressContainer}>
              <View style={[styles.thumbnailProgress, { width: `${pct}%` }]} />
            </View>
          )}
        </View>

        <View style={styles.videoInfo}>
          <Text style={[styles.videoTitle, watchedVideos.includes(video.id) && { color: 'red' }]}>
            {video.title}
          </Text>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {video.description}
          </Text>

          <View style={styles.videoActions}>
            <TouchableOpacity onPress={() => toggleFavorite(video.id)} style={styles.favButton}>
              <FontAwesome name={favorites[video.id] ? 'heart' : 'heart-o'} size={20} color={favorites[video.id] ? '#E91E63' : '#666'} />
            </TouchableOpacity>

            <View style={styles.chapterTag}>
              <Text style={styles.chapterTagText}>Chapter {courseData[chapterIndex].chapterNumber}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // const openFullScreen = () => {
  //   setFullScreenVideo(selectedVideo);
  // };
  const openFullScreen = () => {
  if (!fullScreenVideo) {
    setFullScreenVideo(selectedVideo);
  }
};

const closeFullScreen = () => {
  // cleanup before closing
  if (videoRef.current) {
    try { videoRef.current.pause?.(); } catch {}
  }
  setFullScreenVideo(null);
};
const getVideoPercentage = (videoId) => {
  const secs = watchProgress[videoId] || 0;
  const allVideos = courseData.flatMap(c => c.videos || []);
  const vid = allVideos.find(v => v.id === videoId);
  if (!vid || !vid.durationSeconds) return 0;
  return Math.min((secs / vid.durationSeconds) * 100, 100);
};

// Calculate total course progress (all videos average %)
const getTotalCoursePercentage = () => {
  const allVideos = courseData.flatMap(c => c.videos || []);
  if (allVideos.length === 0) return 0;
  const percentages = allVideos.map(v => getVideoPercentage(v.id));
  const total = percentages.reduce((a, b) => a + b, 0);
  return total / allVideos.length;
};

const onProgress = (data) => {
  setCurrentTime(data.currentTime);
  setDuration(data.seekableDuration || data.playableDuration || duration);

  if (selectedVideo) {
    setWatchProgress(prev => ({
      ...prev,
      [selectedVideo.id]: data.currentTime
    }));

    // Log live progress (optional)
    console.log("Video", selectedVideo.id, "Watched:", data.currentTime.toFixed(1), "sec", "-", getVideoPercentage(selectedVideo.id).toFixed(1), "%");
  }
};

  // Full-screen modal player
const FullScreenVideo = () => {
  const [paused, setPaused] = useState(false);
  const ref = useRef(null);
  const videoId = String(fullScreenVideo?.id || '');

  const togglePlayPauseFS = () => setPaused(prev => !prev);

  const handleStop = () => {
    setPaused(true);
    const secs = watchProgress[videoId] || 0;
    const pct = getVideoPercentage(videoId);
    console.log("STOP:", {
      videoId,
      watchedSeconds: secs.toFixed(1),
      percentage: pct.toFixed(1) + "%",
      totalCourse: getTotalCoursePercentage().toFixed(1) + "%"
    });
    // later: dispatch/save to backend
  };

  return (
    <Modal visible={!!fullScreenVideo} supportedOrientations={['portrait', 'landscape']} animationType="fade">
      <View style={styles.fullScreenContainer}>
        <Video
          ref={ref}
          source={{ uri: fullScreenVideo?.url }}
          style={styles.fullScreenVideo}
          resizeMode="cover"
          paused={paused}
          onProgress={({ currentTime }) => {
            setWatchProgress((prev) => ({ ...prev, [videoId]: currentTime }));
          }}
          onLoad={() => {
            const pos = watchProgress[videoId] || 0;
            if (ref.current && typeof ref.current.seek === 'function' && pos > 0) {
              ref.current.seek(pos);
            }
          }}
          onEnd={() => {
            const durationSecs = fullScreenVideo?.durationSeconds || 0;
            setWatchProgress((prev) => ({ ...prev, [videoId]: durationSecs }));
            console.log("Video End:", videoId, "100%");
          }}
        />

        {/* STOP button */}
        <TouchableOpacity style={styles.stopButton} onPress={handleStop}>
          <Ionicons name="stop-circle" size={48} color="red" />
        </TouchableOpacity>

        {/* Play/Pause toggle */}
        <TouchableOpacity style={styles.fullScreenPlayButton} onPress={togglePlayPauseFS}>
          <Ionicons name={paused ? 'play-circle' : 'pause-circle'} size={64} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        {/* Close */}
        <TouchableOpacity style={styles.closeButton} onPress={() => setFullScreenVideo(null)}>
          <Ionicons name="close" size={30} color="white" />
        </TouchableOpacity>

        {/* Progress bar (same as small player) */}
        <Slider
          style={styles.progressSlider}
          minimumValue={0}
          maximumValue={1}
          value={(watchProgress[videoId] || 0) / (fullScreenVideo?.durationSeconds || 1)}
          onSlidingComplete={(val) => {
            const seekTo = val * (fullScreenVideo?.durationSeconds || 0);
            if (ref.current && typeof ref.current.seek === 'function') {
              ref.current.seek(seekTo);
            }
          }}
          minimumTrackTintColor="#FF0000"
          maximumTrackTintColor="#FFFFFF"
          thumbTintColor="#FF0000"
        />
      </View>
    </Modal>
  );
};


  return (
    <ContainerComponent>
      <SafeAreaView style={[styles.container, isFullScreen && styles.fullScreenContainer]}>
        {!isFullScreen && (
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => { props.navigation.goBack(); }}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Programming Course</Text>
            <View style={styles.placeholder} />
          </View>
        )}

        <View style={[styles.content, isFullScreen && styles.fullScreenContent]}>
          {selectedVideo && (
            <TouchableOpacity style={[styles.videoSection1, isFullScreen && styles.fullScreenVideoSection]} activeOpacity={1}>
              <View style={styles.videoSection}>
                <Video
                  ref={videoRef}
                  source={{ uri: selectedVideo.url }}
                  style={[styles.videoPlayer, isFullScreen && styles.fullScreenVideoPlayer]}
                  paused={!isPlaying}
                  onProgress={onProgress}
                  onLoad={(data) => setDuration(data?.duration || selectedVideo.durationSeconds || 0)}
                  resizeMode="stretch"
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
                          // If duration is zero, don't seek.
                          if (!duration) return;
                          const seekTo = val * duration;
                          if (videoRef.current && typeof videoRef.current.seek === 'function') {
                            videoRef.current.seek(seekTo);
                          }
                          setIsPlaying(true);
                        }}
                        minimumTrackTintColor="#FF0000"
                        maximumTrackTintColor="#FFFFFF"
                        thumbTintColor="#FF0000"
                      />

                      <Text style={styles.timeText}>{formatTime(duration)}</Text>

                      {!isFullScreen && (
                        <TouchableOpacity style={styles.controlButton} onPress={openFullScreen}>
                          <Ionicons name="expand-outline" size={24} color="white" />
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
                  <Text style={styles.videoDescriptionLarge}>{selectedVideo.description}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {!isFullScreen && (
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
          )}
        </View>
      </SafeAreaView>

      {fullScreenVideo && <FullScreenVideo />}
    </ContainerComponent>
  );
};

const themedStyles = (colors) => StyleSheet.create({
  // ... reuse your existing styles here exactly as before ...
  container: { flex: 1 },
  fullScreenContainer: { backgroundColor: 'black', flex: 1 },
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
  fullScreenContent: { backgroundColor: '#000' },
  videoSection: { backgroundColor: '#000', position: 'relative' },
  fullScreenVideoSection: { width: '100%', height: '100%', justifyContent: 'center' },
  videoPlayer: { height: 240, width: '100%' },
  fullScreenVideoPlayer: { height: '100%', width: '100%' },
  controlsOverlay: { justifyContent: 'space-between' },
  centerPlayButton: { position: 'absolute', left: 0, right: 0, bottom: 100, justifyContent: 'center', alignItems: 'center' },
  centerPlayIcon: { borderRadius: 50 },
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
});

export default CoursePlayerScreen;
