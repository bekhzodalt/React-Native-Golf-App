import Colors from '../../constants/Color';

const React = require("react-native");

const { StyleSheet } = React;

export default {
    container: {
       height: '100%',    
    },
    content: {
        height: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eeeeee',
    },   
    header: {   
        marginTop: 20,    
        width: "90%",
        justifyContent:'flex-end',       
    },
    headerText: {
        alignItems: 'flex-start',
        fontSize: 24,
        fontWeight: '400',
    },
    btn: {
 
        width: '100%',
        alignItems: 'center',
    },
    firstBtn: {
        width: '60%',
        height: 40,
        borderRadius: 25,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 90
    },
    secondBtn: {
        width: '60%',
        height: 40,
        borderRadius: 25,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    signBtnsTxt: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600'
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
    pickerStyle: {
        width: Platform.OS === "ios" ? '100%' : '63%',
        justifyContent: 'center'
    },
};