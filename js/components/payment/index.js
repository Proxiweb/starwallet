
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import StellarSdk from 'stellar-sdk';
import { Container, Content, Header, Title, InputGroup, Button, Icon, View, Picker, Input, Spinner, Grid, Row, Text } from 'native-base';
import { createStructuredSelector } from 'reselect';

import { selectContacts, selectBalances, selectCurrentStellarKeys, selectEnv } from '../../selectors';
import { openDrawer } from '../../actions/drawer';
import { paid } from '../../actions/stellar';
import { replaceRoute, popRoute } from '../../actions/route';
import myTheme from '../../themes/base-theme';
import styles from './styles';

import { fedLookup, pay } from '../../helpers/api';

function isNumeric(value) {
    if (typeof value === 'number') return true;
    const str = (value || '').toString();
    if (!str) return false;
    return !isNaN(str);
}

class Payment extends Component {
    static propTypes = {
        balances: PropTypes.array.isRequired,
        contacts: PropTypes.array.isRequired,
        stellarKeys: PropTypes.object.isRequired,
        env: PropTypes.string.isRequired,

        navigator: PropTypes.object.isRequired,
        openDrawer: PropTypes.func.isRequired,
        paid: PropTypes.func.isRequired,
        replaceRoute: PropTypes.func.isRequired,
        popRoute: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);

        this.initialState = {
            asset: 'XLM',

            invalidDest: null,
            invalidAmount: null,

            pendingMessage: null,
            error: null,

            paid: false,

            payment: {
                fedId: null,
                dest: null,
                amount: null,
                memo: null,
            },
        };

        this.state = this.initialState;

        this._newPayment = this._newPayment.bind(this);
        this._amountChanged = this._amountChanged.bind(this);
        this._memoChanged = this._memoChanged.bind(this);
        this._destChanged = this._destChanged.bind(this);
        this._handlePress = this._handlePress.bind(this);
        this._handleBlur = this._handleBlur.bind(this);
        this._validate = this._validate.bind(this);
        this._replaceRoute = this._replaceRoute.bind(this);
    }

    componentWillMount() {
        this.setState(this.initialState);
        const routes = this.props.navigator.getCurrentRoutes();
        const accountId = routes[routes.length - 1] && routes[routes.length - 1].passProps ? routes[routes.length - 1].passProps.accountId : null;
        if (accountId) {
            const contact = this.getContact(this.props.contacts, accountId);
            this.setState({
                ...this.state,
                invalidDest: false,
                payment: {
                    ...this.state.payment,
                    dest: accountId,
                    name: contact ? contact.name : null,
                },
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && this.props.contacts && nextProps.contacts && this.props.contacts.length < nextProps.contacts.length) {
            const newContact = this.getContact(nextProps.contacts);
            if (newContact) {
                this.setState({
                    ...this.state,
                    invalidDest: false,
                    message: null,
                    payment: {
                        ...this.state.payment,
                        dest: newContact.accountId,
                        fedId: newContact.fedId || null,
                    },
                });
            }
        }
    }

    _replaceRoute(route) {
        this.props.replaceRoute(route);
    }

    getContact(contactList = null, accountId = null) {
        const id = accountId || this.state.payment.dest;
        const contacts = contactList || this.props.contacts;
        return contacts.find(contact => contact.accountId === id || contact.fedId === id);
    }

    _memoChanged(e) {
        this.setState({
            ...this.state,
            payment: {
                ...this.state.payment,
                memo: e.nativeEvent.text,
            },
        });
    }

    _destChanged(e) {
        this.setState({
            ...this.state,
            payment: {
                ...this.state.payment,
                dest: e.nativeEvent.text,
            },
        });
    }

    _validate() {
        const invalidDest = !StellarSdk.Keypair.isValidPublicKey(this.state.payment.dest);
        this.setState({
            ...this.state,
            invalidDest,
        });
    }

    _handlePress() {
        const { accountId, seed } = this.props.stellarKeys;
        const { asset, payment } = this.state;
        const currencyBal = this.props.balances.find(bal =>
            (asset === 'XLM' && bal.asset_type === 'native') ||
            (asset !== 'XLM' && asset === bal.asset_code)
        );
        const issuer = asset === 'XLM' ? undefined : currencyBal.asset_issuer;
        if (parseFloat(currencyBal.balance) > parseFloat(payment.amount)) {
            this.setState({ ...this.state, error: null, pendingMessage: 'Processing payment...' });
            pay(this.props.env, payment.dest, asset, issuer, payment.amount, { accountId, seed }, payment.memo)
                .then(() => {
                    this.props.paid(payment);
                    this.setState({
                        ...this.state,
                        pendingMessage: null,
                        paid: true,
                        payment: {
                            fedId: null,
                            dest: null,
                            amount: null,
                            memo: null,
                        },
                    });
                })
                .catch(error => this.setState({
                    ...this.state,
                    error: {
                        type: 'payment',
                        message: (error && error.message) || 'Payment failed',
                        err: error,
                    },
                }));
        } else {
            this.setState({
                ...this.state,
                error: {
                    type: 'payment',
                    message: 'Invalid amount',
                },
            });
        }
    }

    _newPayment() {
        this.setState(this.initialState);
    }

    _amountChanged(e) {
        const invalidAmount = !isNumeric(e.nativeEvent.text);
        this.setState({
            ...this.state,
            invalidAmount,
            payment: {
                ...this.state.payment,
                amount: e.nativeEvent.text,
            },
        });
    }

    _handleBlur() {
        const contact = this.getContact();
        const dest = this.state.payment.dest;
        if (!contact && dest) {
            if (dest.indexOf('*') !== -1) {
                this.setState({ ...this.state, error: null, pendingMessage: 'Checking address...' });
                fedLookup(dest)
                    .then(accountId => {
                        this.setState({
                            ...this.state,
                            pendingMessage: null,
                            invalidDest: false,
                            payment: {
                                ...this.state.payment,
                                accountId,
                                fedId: dest,
                            },
                        });
                    })
                    .catch(() => this.setState({
                        ...this.state,
                        invalidDest: true,
                        error: {
                            type: 'federation',
                            message: 'Account not found',
                        },
                    }));
            } else if (!StellarSdk.Keypair.isValidPublicKey(dest)) {
                this.setState({ ...this.state, invalidDest: true, error: { type: 'invalidAccountId', message: 'Invalid account address' } });
            }
        }
    }

    render() {
        //  {/** disabled={error !== null} **/}
        const { payment, error, pendingMessage, paid, invalidDest } = this.state;  // eslint-disable-line
        const accountIdOk = (error && error.type !== 'federation' && error.type !== 'invalidAccountId') || (!error && invalidDest === false);
        const showMessage = error || paid;

        let fedColor;
        if (invalidDest === null) fedColor = 'gray';
        if (invalidDest === false) fedColor = 'green';
        if (invalidDest === true) fedColor = 'red';

        return (
            <Container theme={myTheme}>
                <Header>
                    <Button transparent onPress={this.props.popRoute}>
                        <Icon name="ios-arrow-back" />
                    </Button>
                    <Title>Send a payment</Title>
                    <Button transparent onPress={this.props.openDrawer}>
                      <Icon name="ios-menu" />
                    </Button>
                </Header>

                <Content>
                    <View style={styles.bg}>
                        <Grid>
                            <Row size={1}>
                                {!error && pendingMessage && <View style={styles.spinnerArea}>
                                    <Spinner color="gray" />
                                    <Text>{pendingMessage}</Text>
                                </View>}
                                {showMessage && <View style={[styles.notificationArea, error ? styles.error : styles.success]}>
                                    <Text style={styles.notificationMessage}>{paid ? 'Payment sent !' : error.message}</Text>
                                </View>}
                            </Row>
                            <Row size={3}>
                                {!this.state.paid && <View style={styles.formArea}>
                                    <Picker
                                        selectedValue={this.state.asset}
                                        onValueChange={(asset) => this.setState({ asset })}
                                        style={{ color: 'gray' }}
                                    >
                                        {this.props.balances.map((bal, idx) => {
                                            const balAsset = bal.asset_type !== 'native' ? bal.asset_code : 'XLM';
                                            return <Picker.Item key={idx} label={balAsset} value={balAsset} />;
                                        })}
                                    </Picker>
                                    <InputGroup style={styles.input} success={accountIdOk} error={fedColor === 'red'}>
                                        <Icon name="ios-person" style={{ color: fedColor }}/>
                                        <Input
                                            placeholder="stellar address"
                                            autoCorrect={false}
                                            placeholderTextColor="gray"
                                            onChange={this._destChanged}
                                            onSubmitEditing={this._validate}
                                            onBlur={this._handleBlur}
                                            defaultValue={payment.name || payment.fedId || payment.dest}
                                        />
                                    </InputGroup>
                                    <InputGroup style={styles.input}>
                                        <Icon name="ios-arrow-forward" style={{ color: 'gray' }} />
                                        <Input
                                            placeholder="amount"
                                            placeholderTextColor="gray"
                                            autoCorrect={false}
                                            keyboardType="numeric"
                                            onChange={this._amountChanged}
                                            underlineColorAndroid={this.state.invalidAmount ? 'red' : 'green'}
                                        />
                                    </InputGroup>
                                    <InputGroup style={styles.input}>
                                        <Icon name="ios-text" style={{ color: 'gray' }} />
                                        <Input
                                            placeholder="memo (optional)"
                                            placeholderTextColor="gray"
                                            autoCorrect={false}
                                            onChange={this._memoChanged}
                                        />
                                    </InputGroup>
                                </View>}
                            </Row>
                            <Row size={2}>
                                <View style={styles.submitArea}>
                                    <View style={{ backgroundColor: 'white' }}>
                                        {!paid && <Button large primary textStyle={{ color: 'white' }} style={styles.button} onPress={this._handlePress}>
                                            <Icon name="ios-send" style={{ color: 'white' }}/>
                                            Send payment
                                        </Button>}
                                        {paid && <Button large primary textStyle={{ color: 'white' }} style={styles.button} onPress={this._newPayment}>
                                            <Text style={{ color: 'white', fontSize: 20 }}>Send another payment</Text>
                                        </Button>}
                                    </View>
                                </View>
                            </Row>
                        </Grid>
                    </View>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    contacts: selectContacts(),
    stellarKeys: selectCurrentStellarKeys(),
    balances: selectBalances(),
    env: selectEnv(),
});

const mapDispatchToProps = (dispatch) => (
    {
        replaceRoute: (route) => dispatch(replaceRoute(route)),
        popRoute: () => dispatch(popRoute()),
        openDrawer: () => dispatch(openDrawer()),
        paid: (payment) => dispatch(paid(payment)),
    }
);

export default connect(mapStateToProps, mapDispatchToProps)(Payment);
