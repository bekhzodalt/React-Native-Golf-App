export default {
    container: {
       height: '100%',    
    },

    content: {
        height: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eeeeee',
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

    pickerStyle: {
        width: Platform.OS === "ios" ? '100%' : '60%',
        justifyContent: 'center'
    },
};