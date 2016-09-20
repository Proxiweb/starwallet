import { AppRegistry } from 'react-native';
import setup from './js/setup';

global.Buffer = require('buffer').Buffer;

AppRegistry.registerComponent('StarWallet', setup);
