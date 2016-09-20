import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Text } from 'react-native';
import { Container, Content, Header, Title, InputGroup, Button, Icon, View, Input, Spinner, Grid, Row } from 'native-base';
import StellarSdk from 'stellar-sdk';

import { storeStellarKeys } from '../../actions/stellar';
import { openDrawer } from '../../actions/drawer';
import { replaceRoute } from '../../actions/route';
import myTheme from '../../themes/base-theme';
import styles from './styles';

class Register extends Component {
    static propTypes = {
        storeStellarKeys: PropTypes.func.isRequired,
        replaceRoute: PropTypes.func.isRequired,
        openDrawer: PropTypes.func.isRequired,
        mode: PropTypes.string.isRequired,
        env: PropTypes.string.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            invalidAccountId: null,
            invalidSeed: false,
            accountId: null,
            seed: null,
            name: props.mode === 'basic' ? 'master' : null,
            env: props.env,
        };
        this._handlePress = this._handlePress.bind(this);
        this._seedChanged = this._seedChanged.bind(this);
        this._nameChanged = this._nameChanged.bind(this);
        this._validate = this._validate.bind(this);
    }

    _validate(e) {
        const invalidAccountId = !StellarSdk.Keypair.isValidPublicKey(e.nativeEvent.text);
        this.setState({
            ...this.state,
            invalidAccountId,
            accountId: e.nativeEvent.text,
        });
    }

    _seedChanged(e) {
        this.setState({
            ...this.state,
            seed: e.nativeEvent.text,
        });
    }

    _nameChanged(e) {
        this.setState({
            ...this.state,
            name: e.nativeEvent.text,
        });
    }

    _handlePress() {
        const { accountId, seed, env, name } = this.state;
        const stellarKeys = { accountId, seed, name };
        this.props.storeStellarKeys(env, stellarKeys);
    }

    render() {
        const { invalidAccountId } = this.state;
        const { mode } = this.props;
        const showMessage = false;
        const pending = false;
        const error = null;
        let adrColor;
        if (invalidAccountId === true) adrColor = 'red';
        if (invalidAccountId === false) adrColor = 'green';
        if (invalidAccountId === null) adrColor = 'gray';

        return (
          <Container theme={myTheme}>
            <Header>
              <Button transparent onPress={() => this.props.replaceRoute('login')}>
                <Icon name="ios-home" />
              </Button>

              <Title>Add a wallet</Title>

              <Button transparent onPress={this.props.openDrawer}>
                <Icon name="ios-menu" />
              </Button>
            </Header>

            <Content>
                <View style={styles.bg}>
                    <Grid>
                        <Row size={1}>
                            {pending && <View style={styles.spinnerArea}><Spinner color="white" /></View>}
                            {!pending && showMessage && <View style={[styles.notificationArea, error ? styles.error : styles.success]}>
                                <Text style={styles.notificationMessage}>{showMessage}</Text>
                            </View>}
                        </Row>
                        <Row size={3}>
                            <View style={styles.formArea}>
                                {mode !== 'basic' && <InputGroup style={styles.input}>
                                    <Icon name="ios-flag" style={{ color: 'gray' }}/>
                                    <Input
                                        placeholder="wallet's name"
                                        autoCorrect={false}
                                        onSubmitEditing={this._nameChanged}
                                        placeholderTextColor="gray"
                                        onChange={this._nameChanged}
                                    />
                                </InputGroup>}
                                <InputGroup style={styles.input} success={invalidAccountId === false} error={invalidAccountId === true}>
                                    <Icon name="ios-person" style={{ color: adrColor }}/>
                                    <Input
                                        placeholder="stellar address"
                                        autoCorrect={false}
                                        onSubmitEditing={this._validate}
                                        placeholderTextColor="gray"
                                        onChange={this._validate}
                                        underlineColorAndroid={adrColor}
                                    />
                                </InputGroup>
                                <InputGroup style={styles.input}>
                                    <Icon name="ios-lock" style={{ color: 'gray' }}/>
                                    <Input
                                        placeholder="secret"
                                        autoCorrect={false}
                                        onSubmitEditing={this._seedChanged}
                                        placeholderTextColor="gray"
                                        onChange={this._seedChanged}
                                    />
                                </InputGroup>
                            </View>
                        </Row>
                        <Row size={2}>
                            <View style={styles.submitArea}>
                                <View style={{ backgroundColor: 'white' }}>
                                    {<Button large primary textStyle={{ color: 'white' }} style={styles.button} onPress={this._handlePress}>
                                        <Icon name="ios-add" style={{ color: 'white' }}/>
                                        Add this wallet
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

const mapStateToProps = (state) => ({
    mode: state.stellar.mode,
    env: state.stellar.env,
});

const mapDispatchToProps = (dispatch) => ({
    openDrawer: () => dispatch(openDrawer()),
    storeStellarKeys: (env, stellarKeys) => dispatch(storeStellarKeys(env, stellarKeys)),
    replaceRoute: (route) => dispatch(replaceRoute(route)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Register);
