import Colors from '../../constants/Color';

const React = require("react-native");
import { Platform } from 'react-native';
const { StyleSheet } = React;

export default {
    content: {
      
        width: "100%",
        alignItems: "center"
    },   
    header: {   
        marginTop: Platform.OS == "android" ?  20 : 80,    
        width: "90%",
        justifyContent:'flex-end',       
    },
    headerText: {
        alignItems: 'flex-start',
        fontSize: 24,
        fontWeight: '400',
    },
    inputField: {
        width: '90%',
        marginTop: 20,
        justifyContent: "flex-start",
    },
    inputTitle: {
        alignItems: 'flex-start',
        fontSize: 16,
    },
    textInputField: {
        fontSize: 16,
        color: 'black',
        width: '100%',
        borderWidth: 1,        
        borderColor: 'darkgray',
        backgroundColor: 'transparent',
        paddingVertical: 12,
        paddingHorizontal: 5,
        marginTop: 10,
    },
    forgotPassTxt: {
        marginTop: 14,
        // color: Colors.gray2
    },
    signBtn: {
        width: '90%',
        height: 50,
        borderRadius: 25,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30
    },
    signBtnsTxt: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600'
    },
    altBtnField: {
        marginTop: 20,
        width: '80%',
        alignItems: 'stretch',  
        flexDirection: 'row',

    },
    altBtn: {
        width: 50,
        height: 40,
        flex: 1,
        paddingTop: 10
    },
    forgotBtnTxt: {
        fontSize: 16,
        textAlign: 'left'
    },
    signUpBtnTxt: {
        fontSize: 16,
        textAlign: 'right',
        paddingRight: 20
    },
    footer: {
        bottom: 40,
        position: 'absolute',
    }
    
};