import React from 'react-native';

const { StyleSheet, Dimensions } = React;
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;
const padding = 10;

module.exports = StyleSheet.create({
    row: {
        flex: 1,
        alignItems: 'flex-end',
    },
    spinnerArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceWidth - (padding * 2),
    },
    submitArea: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
        color: '#000',
        marginBottom: 15,
        alignItems: 'center',
    },
    notificationMessage: {
        textAlign: 'center',
        color: 'white',
        fontSize: 20,
    },
    error: {
        backgroundColor: '#d9534f',
    },
    success: {
        backgroundColor: '#5cb85c',
    },
    notificationArea: {
        height: 80,
        flex: 1,
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: deviceWidth - (padding * 2),
    },
    footer: {
        width: 600,
    },
    bg: {
        // flex: 1,
        height: deviceHeight,
        width: deviceWidth,
        // marginTop: deviceHeight/10,
        // backgroundColor: '#FFF',
        paddingLeft: padding,
        paddingRight: padding,
        paddingBottom: 20,
        bottom: 0,
    },
    assets: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    assetItem: {
        flex: 1,
    },
    button: {
        width: deviceWidth - (padding * 2),
        marginLeft: padding,
    },
});
