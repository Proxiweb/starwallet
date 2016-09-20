import { AppRegistry, StatusBar } from 'react-native';
import setup from './js/setup';

global.Buffer = global.Buffer || require('buffer').Buffer;  // eslint-disable-line

StatusBar.setBarStyle('light-content');
AppRegistry.registerComponent('StarWallet', setup);
