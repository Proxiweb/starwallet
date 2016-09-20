import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import round from 'lodash.round';
import { Clipboard } from 'react-native';
import truncate from 'lodash.truncate';
import { Container, Header, Title, Content, View, Text, Button, Icon, Spinner, Grid, Row } from 'native-base';
import { createStructuredSelector } from 'reselect';

import { openDrawer } from '../../actions/drawer';
import { pushNewRoute } from '../../actions/route';
import { loadUserAccount, clearError, loadStellarKeys, removeWallet, loadContacts } from '../../actions/stellar';
import myTheme from '../../themes/base-theme';
import Warning from '../warning';
import styles from './styles';

import {
    selectBalances,
    selectCurrentStellarKeys,
    selectCurrentWalletName,
    selectEnv,
    selectMode,
    selectError,
    selectPending,
    selectContacts,
} from '../../selectors';

class Home extends Component {
    static propTypes = {
        walletName: PropTypes.string,
        stellarKeys: PropTypes.object,
        balances: PropTypes.array,
        contacts: PropTypes.array,
        env: PropTypes.string.isRequired,
        mode: PropTypes.string.isRequired,
        error: PropTypes.object,
        pending: PropTypes.bool.isRequired,
        navigator: PropTypes.object.isRequired,
        loadUserAccount: PropTypes.func.isRequired,
        loadStellarKeys: PropTypes.func.isRequired,
        loadContacts: PropTypes.func.isRequired,
        removeWallet: PropTypes.func,
        clearError: PropTypes.func.isRequired,
        pushNewRoute: PropTypes.func.isRequired,
        openDrawer: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            revealSeed: false,
        };
        this._revealToggle = this._revealToggle.bind(this);
        this._navigateTo = this._navigateTo.bind(this);
        this._removeWallet = this._removeWallet.bind(this);
    }

    componentDidMount() {
        const { stellarKeys, contacts } = this.props;
        if (!stellarKeys) {
            this.props.loadStellarKeys();
        }
        if (!contacts) {
            this.props.loadContacts();
        }
    }

    _revealToggle() {
        this.setState({ revealSeed: true });
    }

    _navigateTo(route) {
        this.props.pushNewRoute(route);
    }

    _removeWallet() {
        const { walletName } = this.props;
        this.props.removeWallet(walletName);
    }

    render() {
        const { stellarKeys, balances, mode, walletName, error, pending } = this.props;
        const { revealSeed } = this.state;

        return (
          <Container theme={myTheme}>
            <Header>
              <Title>{mode === 'basic' ? 'Your wallet' : `Wallet ${walletName ? walletName : ''}`}</Title> // eslint-disable-line
              <Button transparent onPress={this.props.openDrawer}>
                <Icon name="ios-menu" />
              </Button>
            </Header>

            <Content theme={myTheme}>
                <View style={styles.bg}>
                    <Grid>
                        <Row size={1}>
                            {error && error.name === 'NotFoundError' &&
                                <View style={styles.submitArea}>
                                    <View><Text>Account not found</Text></View>
                                    <View><Button textStyle={{ color: 'white' }} onPress={this._removeWallet}>Remove account</Button></View>
                                </View>
                            }
                            {pending && !error && <View style={styles.spinnerArea}><Spinner color="gray" /></View>}
                        </Row>
                        <Row size={5}>
                            {(!stellarKeys) && (
                                <View style={styles.submitArea}>
                                    <View style={{ backgroundColor: 'white' }}>
                                        <Warning />
                                        <Button
                                            style={styles.button}
                                            textStyle={{ color: 'white' }}
                                            large
                                            primary
                                            onPress={() => this._navigateTo('register')}
                                        >
                                            Add a wallet
                                        </Button>
                                    </View>
                                </View>
                            )}
                            {stellarKeys && <View style={{ padding: 40, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                                {balances && balances.map((bal, idx) => (
                                  <View key={idx} style={styles.assets}>
                                      <View style={{ width: 100, flex: 1 }}>
                                          <Text style={styles.text}>{bal.asset_type === 'native' ? 'XLM' : bal.asset_code} </Text>
                                      </View>
                                      <View style={{ width: 100, flex: 1, marginTop: 5 }}>
                                          <Text>{round(parseFloat(bal.balance), 2).toFixed(2)}</Text>
                                      </View>
                                  </View>
                                ))}
                            </View>}
                        </Row>
                        <Row size={2}>
                            {stellarKeys &&
                                <View style={styles.footer}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                        <View>
                                            <Text>Address : {truncate(stellarKeys.accountId, { length: 20 })}</Text>
                                        </View>
                                        {false && <View>
                                            <Button transparent onClick={() => Clipboard.setString(stellarKeys.accountId)}>
                                                <Icon name="ios-clipboard"/>
                                            </Button>
                                        </View>}
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                        <View>
                                            <Text>
                                                Secret : {revealSeed ? truncate(stellarKeys.accountId, { length: 20 }) : '***********************'}
                                            </Text>
                                        </View>
                                        {false && <View>
                                            <Button transparent onClick={() => Clipboard.setString(stellarKeys.seed)}>
                                                <Icon name="ios-clipboard"/>
                                            </Button>
                                        </View>}
                                    </View>
                            </View>
                            }
                        </Row>
                    </Grid>
                </View>
            </Content>
          </Container>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    walletName: selectCurrentWalletName(),
    stellarKeys: selectCurrentStellarKeys(),
    balances: selectBalances(),
    env: selectEnv(),
    mode: selectMode(),
    error: selectError(),
    pending: selectPending(),
    contacts: selectContacts(),
});

const mapDispatchToProps = (dispatch) => ({
    openDrawer: () => dispatch(openDrawer()),
    loadStellarKeys: () => dispatch(loadStellarKeys()),
    loadUserAccount: (accountId) => dispatch(loadUserAccount(accountId)),
    clearError: () => dispatch(clearError()),
    pushNewRoute: (route) => dispatch(pushNewRoute(route)),
    removeWallet: (walletName) => dispatch(removeWallet(walletName)),
    loadContacts: () => dispatch(loadContacts()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
