import Colors from '../../constants/Color';

const React = require("react-native");

const { StyleSheet } = React;

export default {
    content: {
        flexGrow: 1, 
        alignItems: 'center', 
    },   
  
    inputField: {
        width: '90%',
        marginTop: 50,
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
        color: Colors.gray2
    },
    signBtn: {
        width: '90%',
        height: 50,
        borderRadius: 25,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80
    },
    signBtnsTxt: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600'
    },
};