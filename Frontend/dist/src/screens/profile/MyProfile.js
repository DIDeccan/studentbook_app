import React,{useState} from 'react';
import { View, Text, StyleSheet, ScrollView, Image,TouchableOpacity, } from 'react-native';
import ContainerComponent from '../../components/commonComponents/Container';
import { SF, SH } from '../../utils/dimensions';

const ProfileSection1 = () => {
      const tabs = ['All', 'Downloads', 'Favorited', 'Completed Videos'];
      const [selectedTab, setSelectedTab] = useState('All');
    
      const videoData = {
        All: [
          { id: '1', title: 'React Native Basics' },
          { id: '2', title: 'JavaScript Arrays' },
          { id: '3', title: 'State Management' },
        ],
        Downloads: [
          { id: '4', title: 'Offline React Course' },
          { id: '5', title: 'Firebase Setup' },
        ],
        Favorited: [
          { id: '6', title: 'Animation in React Native' },
        ],
        'Completed Videos': [
          { id: '7', title: 'GitHub Crash Course' },
          { id: '8', title: 'Redux Toolkit Intro' },
        ],
      };
      
  return (
    <ContainerComponent>
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Vasavi Pillala</Text>
        <Text style={styles.title}>React Native Developer | Vizianagaram</Text>
      </View>

    {/* Tabs ScrollView */}
      <View style={styles.tabsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsRow}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  selectedTab === tab && styles.activeTab,
                ]}
                onPress={() => setSelectedTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    selectedTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Rendered Videos Below Tabs (No Gap) */}
      <View style={styles.videosWrapper}>
        {videoData[selectedTab]?.map((item) => (
          <View key={item.id} style={styles.videoItem}>
            <Text style={styles.videoTitle}>{item.title}</Text>
          </View>
        ))}
      </View>

      {/* About Section */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.sectionContent}>
          Passionate React Native developer with 2 years of experience building mobile applications.
        </Text>
      </View> */}

      {/* Activity Section */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity</Text>
        <Text style={styles.sectionContent}>
          • Liked "How to Build Better UIs in React Native"{'\n'}
          • Commented on a post about JavaScript performance
        </Text>
      </View> */}

      {/* Experience Section */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Experience</Text>
        <Text style={styles.sectionContent}>
          Software Developer at ABC Technologies{'\n'}
          June 2023 – Present
        </Text>
      </View> */}

      {/* Education Section */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Education</Text>
        <Text style={styles.sectionContent}>
          Bachelor's in Computer Science, XYZ University (2018–2021)
        </Text>
      </View> */}

      {/* Skills Section */}
      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.sectionContent}>
          React Native, JavaScript, REST APIs, Redux, Firebase, Git
        </Text>
      </View> */}
    </ScrollView>
    </ContainerComponent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: '#fff',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 0.8,
    borderBottomColor: '#ddd',
   // backgroundColor: '#f8f9fa',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    color: '#666',
    fontSize: 14,
    marginTop: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 0.8,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: '#0a66c2', // LinkedIn Blue
  },
  sectionContent: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
   tabsWrapper: {
      height: SH(50), // your desired height
      justifyContent: 'center',
      backgroundColor: '#fff',
    },
    tabsRow: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      alignItems: 'center',
    },
    tab: {
      backgroundColor: '#f0f0f0',
      borderRadius: 20,
      paddingHorizontal: 15,
      paddingVertical: 8,
      marginRight: 10,
      borderWidth: 1,
    },
    activeTab: {
      backgroundColor: '#007bff',
    },
    tabText: {
      fontSize: SF(15),
      color: '#333',
    },
    activeTabText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    videosWrapper: {
      paddingHorizontal: 16,
      paddingTop: SH(10), // very minimal padding, adjust or remove if needed
    },
    videoItem: {
      padding: 15,
      marginBottom: 10,
      backgroundColor: '#eaeaea',
      borderRadius: 10,
    },
    videoTitle: {
      fontSize: SF(14),
      color: '#000',
    },
});

export default ProfileSection1;
