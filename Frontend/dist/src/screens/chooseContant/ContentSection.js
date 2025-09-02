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
      content: 'We introducing all maths subjects here.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnXo9SnQvJio9aZsMqeFRvUjMpF5GKFo1eKS1k66mgHe7LPk6AiXCPr5yZ3Q9frNnpbo&usqp=CAU',
    },
    {
      id: 2,
      name: 'English',
      content: 'We introducing all english subjects here.',
      image:
        'https://media.istockphoto.com/id/511281043/photo/multiethnic-group-of-children-and-english-concept.jpg?s=612x612&w=0&k=20&c=BHz06Gw0Ef4C1UI8SpFzAiu3F50XZbQWlSveh0BEn1E=',
    },
    {
      id: 3,
      name: 'Telugu',
      content: 'We introducing all telugu subjects here.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnXo9SnQvJio9aZsMqeFRvUjMpF5GKFo1eKS1k66mgHe7LPk6AiXCPr5yZ3Q9frNnpbo&usqp=CAU',
    },
    {
      id: 4,
      name: 'Science',
      content: 'We introducing all Science subjects here.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnXo9SnQvJio9aZsMqeFRvUjMpF5GKFo1eKS1k66mgHe7LPk6AiXCPr5yZ3Q9frNnpbo&usqp=CAU',
    },
    {
      id: 5,
      name: 'Social',
      content: 'We introducing all Social subjects here.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnXo9SnQvJio9aZsMqeFRvUjMpF5GKFo1eKS1k66mgHe7LPk6AiXCPr5yZ3Q9frNnpbo&usqp=CAU',
    },
    {
      id: 6,
      name: 'Hindi',
      content: 'We introducing all hindi subjects here.',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnXo9SnQvJio9aZsMqeFRvUjMpF5GKFo1eKS1k66mgHe7LPk6AiXCPr5yZ3Q9frNnpbo&usqp=CAU',
    },
  ];
  
  const dropdownSubjects = [{ name: 'All' }, ...subjectsData];

  const ClassDropDown = () => {
    setClassDrop(!classDrop);
  };
  const selectSubject = ()=>{
navigation.navigate('TeluguSubject')
//navigation.navigate('MathSubject')

//navigation.navigate('EnglishSubject')
  }
    const chooseClasses = item => {
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
        <View>
          <TouchableOpacity
            onPress={() => chooseClasses(item)}
            style={{ marginTop: SH(10) }}
          >
            <Text>{item.name}</Text>
          </TouchableOpacity>
        </View>
      );
    };
  
    const filterData =   subjectsData.filter((i) =>
  selectedSubject === '' ? true : i.name.toLowerCase() === selectedSubject.toLowerCase()
);
   
  return (
    <ContainerComponent>
    <View
      style={{ flex: 1, paddingHorizontal: SW(15), paddingVertical: SH(10) }}
    >
      <View style={{marginVertical:SH(20)}}>
        {/* <TextInput
          placeholder="Find your subject"
          onChangeText={e => setSearch(e)}
          value={search}
          style={{ borderWidth: 1 }}
        /> */}
              <Input
                  placeholderTextColor={''}
                  title={translate('Choose subject')}
                  placeholder="Select subject"
                  isRight={true}
                  rightContent={
                    <View style={[]}>
                      <TouchableOpacity onPress={ClassDropDown}>
                        <MaterialIcons
                          size={SF(35)}
                          color={''}
                          name={
                            passVisible
                              ? 'keyboard-arrow-up'
                              : 'keyboard-arrow-down'
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  }
                  value={chooseClass}
                  onChangeHandler={e => setSearch(e)}
                  textInputProps={{
                    style: styles.inputStyle,
                     editable: false,         // 👈 Prevent typing
                     pointerEvents: 'none',
                  }}
                />
                {classDrop === true ? (
                  <View style={[styles.countryCodeDrop]}>
                    <FlatList
                      data={dropdownSubjects}
                      showsVerticalScrollIndicator={false}
                      renderItem={renderSections}
                    />
                  </View>
                ) : null}
      </View>
    
        <FlatList
        showsVerticalScrollIndicator={false}
          data={filterData}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={selectSubject} style={{marginBottom:SH(20),paddingBottom:SH(20),backgroundColor:'white'}}>
                <Image source={{ uri: item.image, }} style={{height:SH(150)}}/>
                <Text style={{fontSize:SF(20),textAlign:'center',marginVertical:SH(5)}}>{item.name}</Text>
                <Text style={{fontSize:SF(15),textAlign:'center'}}>{item.content}</Text>
              </TouchableOpacity>
            );
          }}
        />
   
    </View>
    </ContainerComponent>
  );
};

export default ContentSection;

const styles = StyleSheet.create({
   countryCodeDrop: {
    flex: 1,
    height: SH(150),
    width: SW(200),
    backgroundColor: 'white',
    borderTopWidth: 0,
    borderRadius: SH(5),
    alignItems: 'center',
    marginTop: SH(-1),
    top: SH(79),
    position: 'absolute',
    zIndex: 1,
  },
   inputStyle: {
    fontFamily: Fonts.Medium,
    // color: colors.primaryTextColor,
    fontSize: SF(15),
    //borderWidth:1,
    width: SW(298),
  },
});
