import { StyleSheet } from 'react-native';
import {SF, SH, SW } from '../../utils/dimensions';
import { Colors } from '../../utils/Colors';
import  Fonts  from '../../utils/Fonts';

const Styles =  StyleSheet.create({
  minviewsigninscreen: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    height: '100%',
    width: '100%'
  },
  MinViewContent: {
    width: '100%',
    paddingRight: SH(5),
  },
  valuxlogoimg: {
    width: SW(250),
    height: SH(250),
  },
  scrollviewstyles: {
    width: '100%',
    height: 'auto',
  },
  FlexRowPassword: {
    width: '100%',
    borderRadius: SH(7),
    flexDirection: 'row',
    height: SH(50),
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.black_text_color,
  },
  InputViewWidth: {
    width: '100%'
  },
  IconPostionAboluteTwo: {
    position: 'absolute',
    right: SH(30),
    height: SH(50),
    top: SH(37),
    flexDirection: 'row',
    alignItems: 'center'
  },
  flecoloransdiocn: {
    flexDirection:'row',
    alignItems:'center',
    marginRight:10,
  },
  CountryCodeIconCenter: {
    position: 'absolute',
    left: SH(30),
    height: SH(50),
    zIndex: 89,
    top: SH(33),
    flexDirection: 'row',
    alignItems: 'center'
  },
  PaddingLeftCountryInput: {
    paddingLeft: SH(90)
  },
  notificationivonandimhflexview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginRight: SH(15),
  },
  marginleftandrightsettext: {
    paddingLeft: SH(10),
    paddingRight: SH(10),
  },
  postionset: {
    paddingLeft: SH(10),
    paddingRight: SH(10),
    position:'relative',
    top:SH(3)
  },
  scrollviewstyle: {
    height: 'auto',
    width: '100%'
  },
  setbgimage: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerStyle: {
    backgroundColor: Colors.lavender_blush_colors,
  },
  headerTitleStyle: {
    color: Colors.theme_backgound,
    fontWeight: "700",
    fontSize: SF(22),
  },
  setbgcolorgrsay: {
    backgroundColor: Colors.gray_text_color,
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    opacity: Platform.OS === 'ios' ? 2 : 0.9,
  },
  CenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkiconright: {
    borderWidth: 3,
    height: SW(80),
    width: SW(80),
    borderRadius: SH(100),
    flexDirection: 'row',
    borderColor: Colors.theme_backgound,
    alignItems: 'center',
    justifyContent: 'center'
  },
  setroundcenter: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  setbackgroundicon: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registertextset: {
    paddingTop: SH(25),
    paddingBottom: SH(0),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  settext: {
    color: Colors.black_text_color,
    fontSize: SF(20),
    paddingHorizontal: SH(20),
    textAlign: 'center',
    fontFamily: Fonts.Poppins_Medium,
  },
  setokbutton: {
    width: '47%'
  },
  buttonminview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SH(40),
    paddingTop: SH(20),
  },
  ModalView: {
    backgroundColor: Colors.white_text_color,
    borderRadius: SH(7),
    shadowColor: Colors.black_text_color,
    shadowOffset: {
      width: SW(0),
      height: SH(2)
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: SH(20),
    width: '95%',
  },
});

export default Styles