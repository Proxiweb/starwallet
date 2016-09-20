import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Switch, View } from 'react-native';
import { Container, Content, Header, Title, Icon, Card, CardItem, Text, Button } from 'native-base';
import { createStructuredSelector } from 'reselect';

import { toggleMode, changeEnv, removeStellarKeys } from '../../actions/stellar';
import { popRoute } from '../../actions/route';
import myTheme from '../../themes/base-theme';
import { selectMode, selectEnv, selectStellarKeys } from '../../selectors';
import Warning from '../warning';

import styles from './styles';

class About extends Component {
    static propTypes = {
        mode: PropTypes.string.isRequired,
        env: PropTypes.string.isRequired,
        stellarKeys: PropTypes.object,
        popRoute: PropTypes.func.isRequired,
        toggleMode: PropTypes.func.isRequired,
        removeStellarKeys: PropTypes.func.isRequired,
        changeEnv: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            mode: this.props.mode,
            env: this.props.env,
        };

        this._toggleMode = this._toggleMode.bind(this);
        this._changeEnv = this._changeEnv.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const { mode, env } = nextProps;
        this.setState({ mode, env });
    }

    _changeEnv() {
        const { env } = this.props;
        const newEnv = env === 'test' ? 'public' : 'test';
        this.props.changeEnv(newEnv);
        this.setState({
            ...this.state,
            newEnv,
        });
    }

    _toggleMode() {
        this.props.toggleMode();
        this.setState({
            ...this.state,
            mode: this.state.mode === 'basic' ? 'advanced' : 'basic',
        });
    }

    render() {
        const { mode, env } = this.state;
        return (
            <Container theme={myTheme}>
                <Header>
                    <Button transparent onPress={this.props.popRoute}>
                        <Icon name="ios-arrow-back" />
                    </Button>
                    <Title>About Star Wallet</Title>
                </Header>
                <Content style={styles.about} >
                    <Warning style={{ height: 200 }}/>
                    <Card>
                        <CardItem>
                            <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <Text>{`${mode} Mode`}</Text>
                                    <Switch
                                        onValueChange={this._toggleMode}
                                        value={mode !== 'basic'}
                                    />
                                </View>
                            </View>
                        </CardItem>
                        {mode === 'advanced' &&
                            <CardItem>
                                <View style={{ flexDirection: 'column', justifyContent: 'space-around' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                        <Text>{`${env} network`}</Text>
                                        <Switch
                                            onValueChange={this._changeEnv}
                                            value={env === 'public'}
                                        />
                                    </View>
                                    {this.props.stellarKeys && <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                                        <Button danger onPress={() => this.props.removeStellarKeys()}>Delete all wallets</Button>
                                    </View>}
                              </View>
                            </CardItem>
                        }
                    </Card>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    mode: selectMode(),
    env: selectEnv(),
    stellarKeys: selectStellarKeys(),
});

const mapDispatchToProps = (dispatch) => ({
    toggleMode: () => dispatch(toggleMode()),
    removeStellarKeys: () => dispatch(removeStellarKeys()),
    changeEnv: (env) => dispatch(changeEnv(env)),
    popRoute: () => dispatch(popRoute()),
});

export default connect(mapStateToProps, mapDispatchToProps)(About);
