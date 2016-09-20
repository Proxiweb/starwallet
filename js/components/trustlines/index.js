import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import truncate from 'lodash.truncate';
import { Container, Content, Header, Title, List, ListItem, Icon, View, Text, Button } from 'native-base';
import { closeDrawer } from '../../actions/drawer';
import { pushNewRoute, popRoute } from '../../actions/route';
import myTheme from '../../themes/base-theme';

import styles from './styles';

class Trustlines extends Component {
    static propTypes = {
        balances: PropTypes.array.isRequired,
        closeDrawer: PropTypes.func.isRequired,
        pushNewRoute: PropTypes.func.isRequired,
        popRoute: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this._navigateTo = this._navigateTo.bind(this);
    }

    _navigateTo(route) {
        this.props.pushNewRoute(route);
    }

    render() {
        const { balances } = this.props;
        return (
            <Container theme={myTheme}>
                <Header>
                    <Button transparent onPress={this.props.popRoute}>
                        <Icon name="ios-arrow-back" />
                    </Button>
                    <Title>Trustlines</Title>
                    <Button transparent onPress={() => this._navigateTo('trustline')}>
                        <Icon name="ios-add" />
                    </Button>
                </Header>
                <Content style={styles.sidebar} >
                    <List foregroundColor={'gray'}>
                        {balances && balances.filter(bal => bal.asset_type !== 'native').map((bal, idx) => {
                            return (
                            <ListItem key={idx}>
                                <View>
                                    <Text>Issuer : {truncate(bal.asset_issuer)}</Text>
                                    <Text>Asset : {bal.asset_code}</Text>
                                    <Text>Limit : {bal.limit}</Text>
                                </View>
                            </ListItem>
                            );
                        })}
                    </List>
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state) => ({
    balances: state.stellar.balances,
});

const mapDispatchToProps = (dispatch) => ({
    closeDrawer: () => dispatch(closeDrawer()),
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: (route, passProps) => dispatch(pushNewRoute(route, passProps)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Trustlines);
