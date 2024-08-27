
import Colors from '../../constants/Color';

const React = require("react-native");

import { Dimensions } from 'react-native';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const logoWidth = windowWidth * 0.9;
const logoHeight = logoWidth * 1.1;

const { StyleSheet } = React;

export default {
    container: {
        height: '100%',    
        flex: 1
     },
     content: {
        flex: 1    
     },
     header: {   
         marginTop: 50,    
         justifyContent:'flex-end',    
         alignItems: 'center',
     },
     headerText: {
         alignItems: 'flex-start',
         fontSize: 24,
         fontWeight: '400',
     },

     footer: {
        width: '100%',
        bottom: 0,
        position: 'absolute',
        height: 70,
        backgroundColor: '#bbbbbb',
        alignItems: 'center',
        paddingTop: 10
    },
    btnField: {
        width: '80%',
        paddingBottom: 0,
        flexDirection: 'row',
    },
    forgotBtnTxt: {
        fontSize: 16,
        textAlign: 'left'
    },
    signUpBtnTxt: {
        fontSize: 16,
        textAlign: 'right',
        paddingRight: 20,
        fontWeight: '600'
    },
    altBtn: {
        width: 50,
        height: 40,
        flex: 1,
        paddingTop: 10
    },
};