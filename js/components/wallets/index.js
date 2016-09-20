import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Content, Text, List, ListItem, Container, Header, Button, Icon, Title } from 'native-base';
import { createStructuredSelector } from 'reselect';

import { popRoute, pushNewRoute } from '../../actions/route';
import { changeWallet } from '../../actions/stellar';
import myTheme from '../../themes/base-theme';
import styles from './styles';
import { selectCurrentWalletName, selectEnv, selectStellarKeys } from '../../selectors';

class Wallets extends Component {
    static propTypes = {
        stellarKeys: PropTypes.object.isRequired,
        walletName: PropTypes.string.isRequired,
        env: PropTypes.string.isRequired,

        popRoute: PropTypes.func.isRequired,
        changeWallet: PropTypes.func.isRequired,
        pushNewRoute: PropTypes.func.isRequired,
    }

    render() {
        const { stellarKeys, walletName, env } = this.props;
        const walletNames = Object.keys(stellarKeys[env]);

        return (
        <Container theme={myTheme}>
            <Header>
                <Button transparent onPress={this.props.popRoute}>
                    <Icon name="ios-arrow-back" />
                </Button>
                <Title>{`Wallets (${env})`}</Title>
                <Button transparent onPress={() => this.props.pushNewRoute('register')}>
                    <Icon name="ios-add" />
                </Button>
            </Header>
            <Content style={styles.sidebar} >
                <List
                    foregroundColor={'white'}
                    dataArray={walletNames}
                    renderRow={(item) =>
                        <ListItem button key={item} onPress={() => this.props.changeWallet(env, item)}>
                            <Text style={{ color: item === walletName ? 'black' : 'gray' }}>{item}</Text>
                        </ListItem>
                    }
                />
            </Content>
        </Container>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    walletName: selectCurrentWalletName(),
    stellarKeys: selectStellarKeys(),
    env: selectEnv(),
});

const mapDispatchToProps = (dispatch) => ({
    popRoute: () => dispatch(popRoute()),
    changeWallet: (env, name) => dispatch(changeWallet(env, name)),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Wallets);
