import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { SF, SH, SW } from '../../utils/dimensions';
import ContainerComponent from '../../components/commonComponents/Container';
import Fonts from '../../utils/Fonts';
import Input from '../../components/commonComponents/Input';
import { translate } from '../../utils/config/i18n';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const ContentSection = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [chooseClass, setChooseClass] = useState(false);
  const [classDrop, setClassDrop] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const subjectsData = [
    {
      id: 1,
      name: 'Maths',
      content: 'Algebra, Geometry, Calculus and more',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnXo9SnQvJio9aZsMqeFRvUjMpF5GKFo1eKS1k66mgHe7LPk6AiXCPr5yZ3Q9frNnpbo&usqp=CAU',
      class: 6,
      icon: 'calculator',
      progressPercentage: 30,
      color: '#FF6B6B'
    },
    {
      id: 2,
      name: 'English',
      content: 'Grammar, Literature, Writing skills',
      image: 'https://media.istockphoto.com/id/511281043/photo/multiethnic-group-of-children-and-english-concept.jpg?s=612x612&w=0&k=20&c=BHz06Gw0Ef4C1UI8SpFzAiu3F50XZbQWlSveh0BEn1E=',
      class: 6,
      icon: 'book',
      progressPercentage: 65,
      color: '#4ECDC4'
    },
    {
      id: 3,
      name: 'Telugu',
      content: 'Language, Poetry, Literature',
      image: 'https://img.freepik.com/free-vector/abstract-hand-drawn-telugu-diwali-card_23-2148815778.jpg',
      class: 6,
      icon: 'language',
      progressPercentage: 20,
      color: '#FFD166'
    },
    {
      id: 4,
      name: 'Science',
      content: 'Physics, Chemistry, Biology',
      image: 'https://img.freepik.com/free-vector/science-word-theme_23-2148540555.jpg',
      class: 6,
      icon: 'flask',
      progressPercentage: 45,
      color: '#06D6A0'
    },
    {
      id: 5,
      name: 'History',
      content: 'Ancient, Medieval, Modern history',
      image: 'https://img.freepik.com/free-vector/hand-drawn-history-background_23-2148832292.jpg',
      class: 6,
      icon: 'hourglass',
      progressPercentage: 80,
      color: '#118AB2'
    },
    {
      id: 6,
      name: 'Hindi',
      content: 'Grammar, Literature, Writing',
      image: 'https://img.freepik.com/free-vector/hand-painted-hindi-diwali-card_23-2148806848.jpg',
      class: 6,
      icon: 'pen',
      progressPercentage: 55,
      color: '#073B4C'
    },
  ];
  
  const dropdownSubjects = [{ name: 'All' }, ...subjectsData];

  const ClassDropDown = () => {
    setClassDrop(!classDrop);
  };
  
  const selectSubject = (subject) => {
    // Navigate to specific subject based on selection
    navigation.navigate(`${subject.name}Subject`);
  };
  
  const chooseClasses = (item) => {
    if (item.name === 'All') {
      setSelectedSubject('');  // Clear filter
    } else {
      setSelectedSubject(item.name);
    }
    setChooseClass(item.name);
    setClassDrop(false);
  };
  
  const renderSections = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => chooseClasses(item)}
        style={styles.dropdownItem}
      >
        <Text style={styles.dropdownText}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const filterData = subjectsData.filter((i) =>
    selectedSubject === '' ? true : i.name.toLowerCase() === selectedSubject.toLowerCase()
  );
  
  const renderSubjectCard = ({ item }) => {
    return (
      <TouchableOpacity 
        onPress={() => selectSubject(item)} 
        style={styles.subjectCard}
      >
        <LinearGradient
          colors={[item.color, `${item.color}80`]}
          style={styles.cardHeader}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
        >
          <View style={styles.cardTitleContainer}>
            <Ionicons name={item.icon} size={SF(20)} color="white" />
            <Text style={styles.cardTitle}>{item.name}</Text>
          </View>
          <Text style={styles.classText}>Class {item.class}</Text>
        </LinearGradient>
        
        <Image source={{ uri: item.image }} style={styles.subjectImage} />
        
        <View style={styles.cardContent}>
          <Text style={styles.subjectDescription}>{item.content}</Text>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>Progress</Text>
              <Text style={styles.percentageText}>{item.progressPercentage}%</Text>
            </View>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${item.progressPercentage}%`,
                    backgroundColor: item.color
                  }
                ]} 
              />
            </View>
          </View>
          
          <LinearGradient
            colors={['rgba(254,238,245,1)', 'rgba(223,238,255,1)']}
            style={styles.actionButton}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          >
            <Text style={styles.actionButtonText}>Continue Learning</Text>
            <Ionicons name="arrow-forward" size={SF(16)} color="#4361EE" />
          </LinearGradient>
        </View>
      </TouchableOpacity>
    );
  };
   
  return (
    <ContainerComponent>
      <View style={styles.container}>
        {/* Header with reduced height and back button */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={SF(24)} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Subjects</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.filterContainer}>
          <Input
            placeholderTextColor={'#999'}
            title={translate('Choose subject')}
            placeholder="Select subject"
            isRight={true}
            rightContent={
              <View>
                <TouchableOpacity onPress={ClassDropDown}>
                  <MaterialIcons
                    size={SF(25)}
                    color={'#666'}
                    name={classDrop ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                  />
                </TouchableOpacity>
              </View>
            }
            value={chooseClass}
            onChangeHandler={e => setSearch(e)}
            textInputProps={{
              style: styles.inputStyle,
              editable: false,
              pointerEvents: 'none',
            }}
          />
          
          {classDrop && (
            <View style={styles.countryCodeDrop}>
              <FlatList
                data={dropdownSubjects}
                showsVerticalScrollIndicator={false}
                renderItem={renderSections}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          )}
        </View>
    
        <FlatList
          showsVerticalScrollIndicator={false}
          data={filterData}
          renderItem={renderSubjectCard}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ContainerComponent>
  );
};

export default ContentSection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SW(15),
    paddingTop: SH(10),
    //backgroundColor: '#F8F9FA'
  },
  // Header with reduced height
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SH(15),
    height: SH(40), // Reduced header height
  },
  backButton: {
    padding: SW(5),
  },
  headerTitle: {
    fontSize: SF(20), // Slightly smaller font
    fontFamily: Fonts.Bold,
    color: '#333',
    textAlign: 'center'
  },
  placeholder: {
    width: SW(30), // Same as back button for balance
  },
  filterContainer: {
    marginBottom: SH(20),
    zIndex: 10,
  },
  inputStyle: {
    fontFamily: Fonts.Medium,
    color: '#333',
    fontSize: SF(15),
    width: '100%',
    backgroundColor: 'white',
    borderRadius: SW(10),
    paddingHorizontal: SW(15),
    height: SH(50),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countryCodeDrop: {
    maxHeight: SH(150),
    width: '100%',
    backgroundColor: 'white',
    borderRadius: SW(10),
    marginTop: SH(5),
    padding: SW(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingVertical: SH(10),
    paddingHorizontal: SW(5),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  dropdownText: {
    fontSize: SF(15),
    fontFamily: Fonts.Medium,
    color: '#333'
  },
  listContent: {
    paddingBottom: SH(20)
  },
  subjectCard: {
    backgroundColor: 'white',
    borderRadius: SW(15),
    marginBottom: SH(20),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SW(12), // Slightly reduced padding
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: SF(16), // Slightly smaller font
    fontFamily: Fonts.Bold,
    color: 'white',
    marginLeft: SW(8)
  },
  classText: {
    fontSize: SF(12), // Slightly smaller font
    fontFamily: Fonts.Medium,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: SW(8),
    paddingVertical: SH(2),
    borderRadius: SW(20)
  },
  subjectImage: {
    height: SH(140), // Slightly reduced height
    width: '100%',
  },
  cardContent: {
    padding: SW(12), // Slightly reduced padding
  },
  subjectDescription: {
    fontSize: SF(13), // Slightly smaller font
    fontFamily: Fonts.Regular,
    color: '#666',
    marginBottom: SH(12),
    lineHeight: SH(18)
  },
  progressContainer: {
    marginBottom: SH(12),
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SH(5),
  },
  progressText: {
    fontSize: SF(13), // Slightly smaller font
    fontFamily: Fonts.Medium,
    color: '#333',
  },
  percentageText: {
    fontSize: SF(13), // Slightly smaller font
    fontFamily: Fonts.Bold,
    color: '#333',
  },
  progressBar: {
    height: SH(6), // Slightly thinner progress bar
    backgroundColor: '#F0F0F0',
    borderRadius: SW(3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: SW(3),
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SH(10),
    borderRadius: SW(8),
    marginTop: SH(5),
  },
  actionButtonText: {
    fontFamily: Fonts.Medium,
    fontSize: SF(14),
    marginRight: SW(5),
    color: '#4361EE',
  },
});