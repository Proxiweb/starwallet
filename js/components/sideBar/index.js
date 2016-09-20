
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Content, Text, List, ListItem, Icon } from 'native-base';
import { createStructuredSelector } from 'reselect';

import { selectMode, selectStellarKeys, selectEnv, selectBalances } from '../../selectors';
import { closeDrawer } from '../../actions/drawer';
import { pushNewRoute } from '../../actions/route';
import styles from './style';

class SideBar extends Component {
    static propTypes = {
        closeDrawer: PropTypes.func.isRequired,
        balances: PropTypes.array,
        pushNewRoute: PropTypes.func.isRequired,
        mode: PropTypes.string.isRequired,
        env: PropTypes.string.isRequired,
        stellarKeys: PropTypes.object,
    }

    navigateTo(route, passProps) {
        this.props.closeDrawer();
        this.props.pushNewRoute(route, passProps);
    }

    render() {
        const { mode, env, stellarKeys, balances } = this.props;
        return (
            <Content style={styles.sidebar} >
                <List foregroundColor={'white'} listBorderColor="black">
                    <ListItem iconLeft onPress={() => this.navigateTo('home')}>
                        <Icon name="ios-home" />
                        <Text>Home</Text>
                    </ListItem>
                    {balances && <ListItem iconLeft onPress={() => this.navigateTo('payment', { accountId: undefined })} >
                        <Icon name="ios-send" />
                        <Text>Send</Text>
                    </ListItem>}
                    {balances && <ListItem iconLeft onPress={() => this.navigateTo('contacts')} >
                        <Icon name="ios-people" />
                        <Text>Contacts</Text>
                    </ListItem>}
                    {balances && <ListItem iconLeft onPress={() => this.navigateTo('trustlines')} >
                        <Icon name="ios-checkmark" />
                        <Text>Trustlines</Text>
                    </ListItem>}
                    {balances && <ListItem iconLeft onPress={() => this.navigateTo('history')} >
                        <Icon name="ios-list-outline" />
                        <Text>Last transactions</Text>
                    </ListItem>}
                    <ListItem iconLeft onPress={() => this.navigateTo('about')} >
                        <Icon name="ios-help" />
                        <Text>About</Text>
                    </ListItem>
                    {mode !== 'basic' && stellarKeys && stellarKeys[env] && <ListItem iconLeft onPress={() => this.navigateTo('wallets')} >
                        <Icon name="ios-card" />
                        <Text>Wallets</Text>
                    </ListItem>}
                </List>
            </Content>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    mode: selectMode(),
    stellarKeys: selectStellarKeys(),
    balances: selectBalances(),
    env: selectEnv(),
});

function bindAction(dispatch) {
    return {
        closeDrawer: () => dispatch(closeDrawer()),
        pushNewRoute: (route, passProps) => dispatch(pushNewRoute(route, passProps)),
    };
}

export default connect(mapStateToProps, bindAction)(SideBar);
