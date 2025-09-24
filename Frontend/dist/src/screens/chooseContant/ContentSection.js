import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SF, SH, SW } from '../../utils/dimensions';
import ContainerComponent from '../../components/commonComponents/Container';
import Fonts from '../../utils/Fonts';
import Input from '../../components/commonComponents/Input';
import { translate } from '../../utils/config/i18n';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { darkColors, lightColors } from '../../utils/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubjectsApi } from '../../redux/reducer/demopagereduce';

const ContentSection = ({ navigation }) => {
  const themeMode = useSelector((state) => state.theme.theme);
  let colors = (themeMode === 'dark') ? darkColors : lightColors;
  const styles = themedStyles(colors);
  const [search, setSearch] = useState('');
  const [chooseClass, setChooseClass] = useState(false);
  const [classDrop, setClassDrop] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const SubjectsList = useSelector((state) => state.demoData.subjectsData)
  const {loading} = useSelector((state)=> state.demoData)
//console.log(SubjectsList,"====")
  useEffect(() => {
    const fetchDashboard = async () => {
      let storedId = await AsyncStorage.getItem('studentId')
      let classid = await AsyncStorage.getItem('classId')
      const studentId = storedId ? JSON.parse(storedId) : null;
      const classId = classid ? JSON.parse(classid) : null;
      if (studentId && classId) {
        let resultAction = await dispatch(SubjectsApi({ student_id: studentId, class_id: classId }))
        //console.log("Dashboard API response:", JSON.stringify(resultAction, null, 2));
      } else {
        console.warn("Missing studentId or classId in AsyncStorage");
      }
    };
    if (isFocused) {
      fetchDashboard();
    }
  }, [isFocused, dispatch]);
  const PlaceHolderImage = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'

  const dropdownSubjects = [{ name: 'All' }, ...SubjectsList];

  const ClassDropDown = () => {
    setClassDrop(!classDrop);
  };

  const selectSubject = (subject) => {
    // Navigate to specific subject based on selection
    //navigation.navigate("TeluguSubject",{subject});
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

  const filterData = SubjectsList?.filter((i) =>
    selectedSubject === '' ? true : i.name.toLowerCase() === selectedSubject?.toLowerCase()
  );

  const renderSubjectCard = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => 
        navigation.navigate("TeluguSubject",{item})
      }
        style={styles.subjectCard}
      >
        <LinearGradient
          colors={[item.color, `${item.color}80`]}
          style={styles.cardHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.cardTitleContainer}>
            <Ionicons name={item.icon} size={SF(20)} color="white" />
            <Text style={styles.cardTitle}>{item.name}</Text>
          </View>
          <Text style={styles.classText}>{item.class_name}</Text>
        </LinearGradient>

        <Image source={{ uri: item.image || PlaceHolderImage }} style={styles.subjectImage} />

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
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
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
            <Ionicons name="arrow-back" size={SF(24)} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Subjects</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.filterContainer}>
          <Input
            placeholderTextColor={'#999'}
            title={translate('Choose subject')}
            placeholder="Select subject"
            //placeholderTextColor={colors.grey}
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
           ListEmptyComponent={
                    loading ? (
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: SH(50) }}>
                        <ActivityIndicator size="large" color={colors.primary} />
                      </View>
                    ) : (
                      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: SH(50) }}>
                        <Text style={{ color: colors.text }}>No Content Available</Text>
                      </View>
                    )
                  }
        />
      </View>
    </ContainerComponent>
  );
};

export default ContentSection;

const themedStyles = (colors) => StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SW(15),
    paddingTop: SH(10),
  },
  // Header with reduced height
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SH(15),
    height: SH(30), // Reduced header height
  },
  backButton: {
    padding: SW(5),
  },
  headerTitle: {
    fontSize: SF(20), // Slightly smaller font
    fontFamily: Fonts.Bold,
    color: colors.text,
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