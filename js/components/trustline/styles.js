const React = require('react-native');

const { StyleSheet, Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const padding = 10;

module.exports = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    },
    bg: {
        // flex: 1,
        height: deviceHeight,
        width: deviceWidth,
        // marginTop: deviceHeight/10,
        backgroundColor: 'white',
        paddingLeft: padding,
        paddingRight: padding,
        paddingBottom: 20,
        bottom: 0,
    },
    input: {
        marginBottom: 20,
        width: deviceWidth - (padding * 2) - 10,
    },
    btn: {
        marginTop: 20,
        alignSelf: 'center',
        width: deviceWidth - (padding * 2) - 10,
    },
    formArea: {
        flex: 1,
        width: deviceWidth - padding,
    },
    buttonArea: {
        width: deviceWidth - padding - 10,
    },
    notificationArea: {
        height: 80,
        flex: 1,
        marginTop: padding,
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceWidth - (padding * 2),
    },
    spinnerArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceWidth - (padding * 2),
    },
    notificationMessage: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
    },
    submitArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    error: {
        backgroundColor: '#d9534f',
    },
    success: {
        backgroundColor: '#5cb85c',
    },
});
