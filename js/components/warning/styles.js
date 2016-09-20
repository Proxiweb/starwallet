import React from 'react-native';

const { StyleSheet, Dimensions } = React;
const deviceWidth = Dimensions.get('window').width;
const padding = 10;

module.exports = StyleSheet.create({
    logo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resume: {
        padding,
    },
    card: {
        width: deviceWidth,
        minHeight: 300,
        marginBottom: padding,
    },
});
