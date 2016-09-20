import { combineReducers } from 'redux';

import drawer from './drawer';
import route from './route';
import stellar from './stellar';

export default combineReducers({
    drawer,
    route,
    stellar,
});
