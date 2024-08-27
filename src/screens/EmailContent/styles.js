const React = require("react-native");

const { StyleSheet } = React;

export default {
    container: {
       height: '100%',  
      
       alignItems: 'center',  
    },
    content: {
       flex: 1    
    },
    header: {   
        marginTop: 20,    
        
        justifyContent:'flex-end',    
        alignItems: 'center',
        height: 60   
    },
    headerText: {
        alignItems: 'flex-start',
        fontSize: 24,
        fontWeight: '400',
    },
    rotationText: {
        alignItems: 'flex-start',
        fontSize: 18,
        fontWeight: '400',
        marginTop: 5,
    },
    tlbHeader: {
        backgroundColor: 'white',
        height: 50,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        padding: 10,
      
    },
    historyContent: {
        backgroundColor: 'white',
        height: 1000,
    },
    itemBlock: {
        
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: 'gray',
        flexDirection: 'row',
        alignItems: 'center',
      
 
    },
    pinId: {
        flex: 1,
        paddingLeft: 20,
        color: 'white',
        fontSize: 16,
    },
    pinDate: {
        flex: 1,
        textAlign: 'left', 
        paddingRight: 5,
        color: 'white',
        fontSize:16,
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


};