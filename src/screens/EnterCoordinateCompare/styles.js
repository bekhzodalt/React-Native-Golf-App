
import Colors from '../../constants/Color';

const React = require("react-native");

const { StyleSheet } = React;

export default {
    container: {
       height: '100%',   
       alignItems:'center' 
    },
    content: {
        flexGrow: 1,        
    },
    header: {   
        marginTop: 20,    
        
        justifyContent:'flex-end',    
        alignItems: 'center',
        height: 120   ,
        marginBottom: 20
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
        marginLeft: '5%',
        
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
        paddingHorizontal: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    btn: {
 
        width: '100%',
        alignItems: 'center',
        marginBottom: 50
    },
    signBtn: {
        width: '60%',
        height: 40,
        borderRadius: 25,
        backgroundColor: 'green',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 70
    },
    signBtnsTxt: {
        fontSize: 16,
        color: 'white',
        fontWeight: '600'
    },
    imageContainer: {
        
        alignItems: 'center',
        marginTop: 20,
        justifyContent: 'center',
        marginBottom: 50
    },
    imageHeader: {   
        marginTop: 40,    
        
        justifyContent:'flex-end',    
        alignItems: 'center',
        height: 60  ,
       
    },
    textContainer: {
        flexDirection: 'row'
    },
    headerImageText: {
        alignItems: 'flex-start',
        fontSize: 16,
        fontWeight: '400',
        marginTop: 5,
        marginRight: 5
    },
    compareText: {
        alignItems: 'flex-start',
        fontSize: 18,
        fontWeight: '400',
        marginTop: 5,
        marginRight: 5,
        marginBottom: 20
    }


};