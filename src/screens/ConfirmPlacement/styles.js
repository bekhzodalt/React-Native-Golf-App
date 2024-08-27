
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
       alignItems: 'center',  
    },
    content: {
        flexGrow: 1,        
    },
    header: {   
        marginTop: 40,    
        
        justifyContent:'flex-end',    
        alignItems: 'center',
        height: 60  ,
       
    },
    headerText: {
        alignItems: 'flex-start',
        fontSize: 16,
        fontWeight: '400',
        marginTop: 5,
        marginRight: 5
    },
    imageContainer: {
        
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'center',
    },
    greenImage: {
      
        width: logoWidth,
        height: logoHeight,

    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '90%',
        marginBottom: 50
    },
    rejectBtn: {
        backgroundColor: '#ea3f25',
        paddingVertical: 20,
        width: '40%',
        alignItems: 'center',
    },
    acceptBtn: {
        backgroundColor: '#3e8c26',
        paddingVertical: 20,
        width: '40%',
        alignItems: 'center',
    },
    btnsTxt: {
        color: 'white',
    },
    pin: {
        width: 25,
        height: 25,
        backgroundColor: '#ea3f25',
        borderRadius: 12.5,
        position: 'absolute', 
        top: 300,
        left: 165
    },
    rotationPin: {
        width: 25,
        height: 25,
        backgroundColor: 'white',
        borderRadius: 12.5,
        position: 'absolute', 
        top: 300,
        left: 185
    }
    ,
    touchable: { flex: 0.5, borderColor: "black", borderWidth: 1 },
    text: { alignSelf: "center" },

    textContainer: {
        flexDirection: 'row'
    },

    


};