import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import validator from 'validator';
import { Container, Content, Header, Title, InputGroup, Button, Icon, Picker, View, Input, Spinner, Grid, Row } from 'native-base';
import { createStructuredSelector } from 'reselect';

import { selectCurrentStellarKeys, selectEnv } from '../../selectors';
import { hostLookup, trust } from '../../helpers/api';
import { trusted } from '../../actions/stellar';
import { openDrawer } from '../../actions/drawer';
import { replaceRoute, popRoute } from '../../actions/route';

import myTheme from '../../themes/base-theme';
import styles from './styles';

class Trustline extends Component {
    static propTypes = {
        env: PropTypes.string.isRequired,
        stellarKeys: PropTypes.object.isRequired,
        trusted: PropTypes.func.isRequired,
        openDrawer: PropTypes.func.isRequired,
        replaceRoute: PropTypes.func.isRequired,
        popRoute: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            pendingMessage: null,
            invalidDomainName: null,
            domainInfos: null,
            error: null,
            trustline: null,
            trusted: false,
        };
        this._anchorChanged = this._anchorChanged.bind(this);
        this._codeChanged = this._codeChanged.bind(this);
        this._amountChanged = this._amountChanged.bind(this);
        this._handlePress = this._handlePress.bind(this);
        this._validate = this._validate.bind(this);
    }

    componentWillMout() {
        this.setState({
            ...this.state,
            error: null,
        });
    }

    _anchorChanged() {
        if (this.state.pendingMessage) {
            this.setState({ ...this.state, pendingMessage: null });
        }
    }

    _validate(e) {
        const invalidDomainName = !validator.isURL(e.nativeEvent.text, {
            protocols: ['https'],
            allow_underscores: true,
        });

        if (!invalidDomainName) {
            this.setState({ ...this.state, pendingMessage: 'Requesting anchor infos...' });
            const hostname = e.nativeEvent.text.replace('https://', '');
            hostLookup(hostname)
                .then(domainInfos => this.setState({
                    ...this.state,
                    pendingMessage: false,
                    error: null,
                    domainInfos,
                    trustline: {
                        ...domainInfos.CURRENCIES[0],
                    },
                }))
                .catch(error => this.setState({
                    ...this.state,
                    pendingMessage: null,
                    error: {
                        type: 'host_lookup',
                        message: `Error when requesting infos from ${hostname}`,
                    },
                }));
        }
    }

    _codeChanged(currencyCode) {
        const newCurrency = this.state.domainInfos.CURRENCIES.find(currency => currency.code === currencyCode);
        this.setState({
            ...this.state,
            trustline: { ...newCurrency, amount: 0 },
        });
    }

    _amountChanged(e) {
        this.setState({
            ...this.state,
            trustline: { ...this.state.trustline, amount: e.nativeEvent.text },
        });
    }

    _handlePress() {
        const { issuer, code } = this.state.trustline;
        const { env, stellarKeys } = this.props;

        const amount = this.state.trustline.amount !== '' ? this.state.trustline.amount.toString() : '';

        const verb = amount === '0' ? 'removing' : 'creating';
        this.setState({ ...this.state, pendingMessage: `${verb} trustline...`, error: null });
        trust(env, code, amount, issuer, stellarKeys)
            .then(() => {
                this.props.trusted();

                this.setState({
                    ...this.state,
                    trusted: true,
                    pendingMessage: null,
                    error: null,
                });
            })
            .catch(error => this.setState({
                ...this.state,
                pendingMessage: null,
                error: {
                    type: 'create_trust',
                    message: `Error while ${verb} trustline`,
                    error,
                },
            }));
    }

    render() {
        const { invalidDomainName, domainInfos, pendingMessage, error, trusted, trustline } = this.state;  // eslint-disable-line
        let adrColor;
        if (invalidDomainName === true) adrColor = 'red';
        if (invalidDomainName === false) adrColor = 'green';
        if (invalidDomainName === null) adrColor = 'gray';

        const remove = this.state.trustline && this.state.trustline.amount === '0';
        return (
          <Container theme={myTheme}>
            <Header>
                <Button transparent onPress={this.props.popRoute}>
                    <Icon name="ios-arrow-back" />
                </Button>

              <Title>Create a trustline</Title>

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
                            {(trusted || error) && <View style={[styles.notificationArea, error ? styles.error : styles.success]}>
                                <Text style={styles.notificationMessage}>{trusted ? `Trustline ${remove ? 'deleted' : 'created'}` : error.message}</Text>
                            </View>}
                        </Row>
                        <Row size={3}>
                            {!trusted && <View style={styles.formArea}>
                                <InputGroup style={styles.input} success={invalidDomainName === false} error={invalidDomainName === true}>
                                    <Icon name="ios-checkmark" style={{ color: adrColor }}/>
                                    <Input
                                        placeholder="domain to trust"
                                        autoCorrect={false}
                                        placeholderTextColor="gray"
                                        onSubmitEditing={this._validate}
                                        onChange={this._anchorChanged}
                                        underlineColorAndroid={adrColor}
                                    />
                                </InputGroup>
                                {domainInfos && domainInfos.CURRENCIES && domainInfos.CURRENCIES.length > 0 && (
                                    <Picker
                                        selectedValue={this.state.trustline.code}
                                        onValueChange={this._codeChanged}
                                        style={{ color: 'gray' }}
                                    >
                                        {domainInfos.CURRENCIES.map((currency, idx) => (
                                            <Picker.Item key={idx} label={`Trust for ${currency.code}`} value={currency.code} />
                                        ))}
                                    </Picker>
                                )}
                                {domainInfos && <InputGroup style={styles.input}>
                                    <Icon name="ios-arrow-forward" />
                                    <Input
                                        placeholder="limit amount to trust"
                                        keyboardType="numeric"
                                        placeholderTextColor="gray"
                                        autoCorrect={false}
                                        onChange={this._amountChanged}
                                    />
                                </InputGroup>}
                                {domainInfos && <Text>Leave blank for no limit, set to 0 to remove trustline</Text>}
                            </View>}
                        </Row>
                        <Row size={2}>
                            <View style={styles.submitArea}>
                                <View style={{ backgroundColor: 'white' }}>
                                    {!trusted && <Button large primary textStyle={{ color: 'white' }} onPress={this._handlePress}>
                                        <Icon name="ios-add" style={{ color: 'black' }}/>
                                        <Text style={{ color: 'white', fontSize: 20 }}>
                                            {remove ? 'Remove' : 'Create'} this trustline
                                        </Text>
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
    stellarKeys: selectCurrentStellarKeys(),
    env: selectEnv(),
});

const mapDispatchToProps = (dispatch) => ({
    openDrawer: () => dispatch(openDrawer()),
    popRoute: () => dispatch(popRoute()),
    trusted: () => dispatch(trusted()),
    replaceRoute: (route) => dispatch(replaceRoute(route)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Trustline);
