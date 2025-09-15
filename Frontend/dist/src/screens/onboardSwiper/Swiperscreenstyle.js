import {SW, SH, SF, widthPercent,  } from '../../utils/dimensions';
import Fonts from '../../utils/Fonts'
import {Colors} from '../../utils/Colors'
import { StyleSheet } from 'react-native';

const SwiperStyles = () => StyleSheet.create({
  buttonCircle: {
    width: SW(95),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    left: SH(16),
    top: SH(4),
    marginHorizontal: '3.3%',
  },
  buttonStyle: {
    width: widthPercent(90),
    marginRight: SH(5),
  },
  getstartedtext: {
    color: Colors.white_text_color,
    fontSize: SF(19),
    fontWeight: '700',
    textAlign: 'center',
  },
  heightsetimage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  bgcolorsigninset: {
    height: '15%',
  },
  titleStyle: {
    color: 'black',
    fontSize: SF(25),
    fontFamily: 'DMSans-Medium',
    paddingHorizontal: SH(15),
    position: 'absolute',
    top: SH(0),
    width: '100%',
    textAlign: 'center',
  },
  nextbuttoncolorset: {
    fontFamily: Fonts.Poppins_Medium,
    fontSize: SF(21),
    position: 'relative',
    top: SH(10),
    color: Colors.theme_backgound,
  },
  textstyle: {
    paddingHorizontal: SH(10),
    color: Colors.black_text_color,
    fontSize: SF(16),
    fontFamily: Fonts.Poppins_Medium,
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    top: SH(-75),
  },
  textstyletwo: {
    paddingLeft: SH(10),
    paddingRight: SH(10),
    color: Colors.black_text_color,
    fontSize: SF(16),
    fontFamily: Fonts.Poppins_Medium,
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    top: SH(-65),
  },
  textstyletheree: {
    paddingHorizontal: SH(10),
    color: Colors.black_text_color,
    fontSize: SF(16),
    fontFamily: Fonts.Poppins_Medium,
    width: '100%',
    textAlign: 'center',
    position: 'relative',
    marginTop: SH(65),
  },
  minflexview: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    alignItems: 'center'
  },
  minviewsigninscreen: {
    width: '90%',
    marginHorizontal: '5%',
    height: '100%',
  },
  minstyleviewphotograpgy: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  keybordtopviewstyle: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagset: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: SH(300),
    marginTop: '35%',
    marginBottom: '35%',
  },
  imagesetus: {
    width: SW(370),
  },
  imagesetusnew: {
    width: SW(370),
    position: 'relative',
    top: SH(90),
  },
  imagoneset: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SH(-150),
  },
  avtivedotsstyle: {
    width: SW(14),
    height: SH(16),
    borderRadius: SH(100),
    backgroundColor: Colors.theme_backgound,
    position: 'relative',
    bottom: SH(50)
  },
  dotstyleset: {
    width: SW(14),
    height: SH(16),
    borderRadius: SH(100),
    backgroundColor: Colors.gray_text_color,
    position: 'relative',
    bottom: SH(50)
  },
    actionButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SH(20),
    borderRadius: SW(8),
    marginTop: SH(5),
  },
});

export default SwiperStyles