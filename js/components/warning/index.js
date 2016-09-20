import React, { Component } from 'react';
import { Image } from 'react-native';
import { View, Text, Card } from 'native-base';
import styles from './styles';

export default class Warning extends Component {
    render() {
        return (
            <Card style={styles.card}>
                <View style={styles.logo}>
                    <Image source={require('./logo.png')} style={{ resizeMode: 'cover' }}/>
                </View>
                <View>
                    <Text style={styles.resume}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>StarWallet 0.1.0</Text>
                        <Text> In this release, keys are stored on device uncrypted. </Text>
                        <Text style={{ textDecorationLine: 'underline' }}>
                            You should store on this version only amounts you can afford to loose.
                        </Text>
                    </Text>
                </View>
            </Card>
        );
    }
}
