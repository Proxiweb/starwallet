import React from 'react-native';

const { StyleSheet, Dimensions } = React;
const deviceWidth = Dimensions.get('window').width;
const padding = 10;

module.exports = StyleSheet.create({
    about: {
        width: deviceWidth,
        backgroundColor: 'white',
    },
});
