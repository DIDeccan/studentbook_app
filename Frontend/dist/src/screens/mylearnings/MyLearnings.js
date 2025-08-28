import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import ContainerComponent from '../../components/commonComponents/Container';
import { SF, SH, SW } from '../../utils/dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';

const MyLearnings = () => {
  const tabs = ['All', 'Downloads', 'Favorited', 'Completed Videos'];
  const [selectedTab, setSelectedTab] = useState('All');
  const [search,setSearch] = useState('')
  const [isTrue,setIsTrue] = useState(false)

  const searchBtn = ()=>{
    setIsTrue(!isTrue)
  }
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
// Filtered videos based on search text
const filteredVideos = videoData[selectedTab]?.filter((item) =>
  item.title.toLowerCase().includes(search.toLowerCase())
);
  return (
    <ContainerComponent>
      {/* Tabs ScrollView */}
      <View style={{flexDirection:'row',justifyContent:'space-between',paddingHorizontal:SW(15),paddingVertical:SH(5)}}>
        <Text style={{fontSize:SF(20)}}>My Courses</Text>
         <TouchableOpacity onPress={searchBtn}>
           <MaterialCommunityIcons
                            size={SH(30)}
                            color={''}
                            name={'search'}
                          />
         </TouchableOpacity>
       
      </View>
      {isTrue? ( <View>
        <TextInput
        style={{borderWidth:1,marginHorizontal:SW(10)}}
        onChangeText={(e)=>setSearch(e)}
        value={search}
        placeholder="Search..."
        />
      </View>):'null'}
       
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
       {filteredVideos?.length > 0 ? (
    filteredVideos.map((item) => (
      <View key={item.id} style={styles.videoItem}>
        <Text style={styles.videoTitle}>{item.title}</Text>
      </View>
    ))
  ) : (
    <Text style={{ textAlign: 'center', marginTop: 20 }}>No results found</Text>
  )}
      </View>
    </ContainerComponent>
  );
};

export default MyLearnings;

const styles = StyleSheet.create({
  tabsWrapper: {
    height: SH(50), // your desired height
    justifyContent: 'center',
   // backgroundColor: '#fff',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  tab: {
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  videoTitle: {
    fontSize: SF(14),
    color: '#000',
  },
});
