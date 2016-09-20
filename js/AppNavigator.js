import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Drawer } from 'native-base';
import { BackAndroid, Platform, StatusBar, Navigator } from 'react-native';
import { closeDrawer } from './actions/drawer';
import { popRoute } from './actions/route';

import Contacts from './components/contacts/';
import Register from './components/register';
import Payment from './components/payment';
import Trustlines from './components/trustlines';
import Trustline from './components/trustline';
import Wallets from './components/wallets';
import About from './components/about';
import ContactEdit from './components/contact_edit';
import History from './components/history';


import Home from './components/home/';
import SideBar from './components/sideBar';
import { statusBarColor } from './themes/base-theme';

export const globalNav = {};

// Navigator.prototype.replaceWithAnimation = (route) => {
//     const activeLength = this.state.presentedIndex + 1;
//     const activeStack = this.state.routeStack.slice(0, activeLength);
//     const activeAnimationConfigStack = this.state.sceneConfigStack.slice(0, activeLength);
//     const nextStack = activeStack.concat([route]);
//     const destIndex = nextStack.length - 1;
//     const nextSceneConfig = this.props.configureScene(route, nextStack);
//     const nextAnimationConfigStack = activeAnimationConfigStack.concat([nextSceneConfig]);
//
//     const replacedStack = activeStack.slice(0, activeLength - 1).concat([route]);
//     this._emitWillFocus(nextStack[destIndex]);
//     this.setState({
//         routeStack: nextStack,
//         sceneConfigStack: nextAnimationConfigStack,
//     }, () => {
//         this._enableScene(destIndex);
//         this._transitionTo(destIndex, nextSceneConfig.defaultTransitionVelocity, null, () => {
//             this.immediatelyResetRouteStack(replacedStack);
//         });
//     });
// };

class AppNavigator extends Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        popRoute: PropTypes.func.isRequired,
        closeDrawer: PropTypes.func.isRequired,
    }

    componentDidMount() {
        globalNav.navigator = this._navigator;

        this.props.store.subscribe(() => {
            if (this.props.store.getState().drawer.drawerState === 'opened') {
                this.openDrawer();
            }

            if (this.props.store.getState().drawer.drawerState === 'closed') {
                this._drawer.close();
            }
        });

        BackAndroid.addEventListener('hardwareBackPress', () => {
            const routes = this._navigator.getCurrentRoutes();

            if (routes[routes.length - 1].id === 'home' || routes[routes.length - 1].id === 'login') {
                return false;
            }
            this.popRoute();
            return true;
        });
    }

    popRoute() {
        this.props.popRoute();
    }

    openDrawer() {
        this._drawer.open();
    }

    closeDrawer() {
        if (this.props.store.getState().drawer.drawerState === 'opened') {
            this._drawer.close();
            this.props.closeDrawer();
        }
    }

    renderScene(route, navigator) {
        switch (route.id) {
        case 'home':
            return <Home navigator={navigator} />;
        case 'payment':
            return <Payment navigator={navigator} />;
        case 'contacts':
            return <Contacts navigator={navigator} />;
        case 'register':
            return <Register navigator={navigator} />;
        case 'trustlines':
            return <Trustlines navigator={navigator} />;
        case 'trustline':
            return <Trustline navigator={navigator} />;
        case 'wallets':
            return <Wallets navigator={navigator} />;
        case 'about':
            return <About navigator={navigator} />;
        case 'history':
            return <History navigator={navigator} />;
        case 'contact_edit':
            return <ContactEdit navigator={navigator} />;
        default :
            return <Home navigator={navigator} />;
        }
    }

    render() {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref} // eslint-disable-line
                type="overlay"
                content={<SideBar navigator={this._navigator} />}
                tapToClose
                acceptPan={false}
                onClose={() => this.closeDrawer()}
                openDrawerOffset={0.2}
                panCloseMask={0.2}
                negotiatePan
            >
                <StatusBar
                    backgroundColor={statusBarColor}
                    barStyle="light-content"
                />
                <Navigator
                    ref={(ref) => this._navigator = ref} // eslint-disable-line
                    configureScene={(route) => Navigator.SceneConfigs.FloatFromRight}
                    initialRoute={{ id: (Platform.OS === 'android') ? 'splashscreen' : 'home', statusBarHidden: true }}
                    renderScene={this.renderScene}
                />
            </Drawer>
        );
    }
}

function bindAction(dispatch) {
    return {
        closeDrawer: () => dispatch(closeDrawer()),
        popRoute: () => dispatch(popRoute()),
    };
}

const mapStateToProps = (state) => ({ drawerState: state.drawer.drawerState });
export default connect(mapStateToProps, bindAction)(AppNavigator);
