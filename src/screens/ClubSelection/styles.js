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
    signBtn: {
        width: '60%',
        height: 40,
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
    pickerItemStyle: {
        width: Platform.OS === "ios" ? '100%' : '50%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    pickerStyle: {
        width: Platform.OS === "ios" ? '100%' : '63%',
        alignItems: 'center'
    },

    signOutBtn: {
        width: 50,
        height: 40,
        flex: 1,
        paddingTop: 10
    },

    signOutBtnTxt: {
        fontSize: 16,
        textAlign: 'right',
        paddingRight: 20,
        fontWeight: '600'
    },

    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        backgroundColor: 'rgba(10, 10, 10, 0.7)'
      },
      modalView: {
        margin: 10,
        width: "90%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        paddingLeft: 20,
        paddingRight: 20, 
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },

      modalPoint: {
        borderRadius: 4, width: 8, height: 8,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 8
      },

      buttonClose: {
        backgroundColor: "green",
        justifyContent: "center",
        width:  100,
        height: 34,
        borderRadius: 10,
        marginTop: 30, 
        marginBottom: 10
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },

      descTextStyle: {
          fontSize: 18, 
          fontWeight: "600",
          textAlign: "left",
          alignItems: "center"
      },

      input: {
        height: 30,
        width: "30%",
        borderWidth: 1,
        padding: 5,
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
    confirmBtnFld:{
        height: 60
    },
    confirmBtn: {
        marginTop: 30,
        backgroundColor: "red",
        height: 40,
        width: 250,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    }, 
    confirmBtnTxt: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    },
    cancelBtnFld:{
        height: 80
    },
    cancelBtn: {
        marginTop: 30,
        backgroundColor: "green",
        height: 40,
        width: 250,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    }, 
    cancelBtnTxt: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    }
};