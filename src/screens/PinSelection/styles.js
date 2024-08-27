const React = require("react-native");

const { StyleSheet } = React;

export default {
    container: {
       height: '100%',    
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
        marginTop: 30,
        padding: 10
    },
    historyContent: {
        backgroundColor: '#666666',
        height: 1000,
    },
    itemBlock: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#eeeeee',
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemGreen: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#eeeeee',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'green'
    },
    
    pinId: {
        flex: 0.8,
        paddingLeft: 20,
        color: 'white',
        fontSize: 16,
    },
    pinMode: {
        flex: 0.8,
        paddingLeft: 10,
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


};