import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Content, Text, List, ListItem, Container, Header, Button, Icon, Title, View } from 'native-base';
import { createStructuredSelector } from 'reselect';
import truncate from 'lodash.truncate';

import { selectPaymentsWithContactName, selectCurrentStellarKeys } from '../../selectors';
import { popRoute } from '../../actions/route';
import myTheme from '../../themes/base-theme';
import styles from './styles';

class History extends Component {
    static propTypes = {
        payments: PropTypes.array.isRequired,
        stellarKeys: PropTypes.object.isRequired,
        popRoute: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this._renderRow = this._renderRow.bind(this);
    }

    _renderRow(item) {
        const { stellarKeys } = this.props;
        return (
            <ListItem iconRight button>
                <View style={{ flexDirection: 'row' }}>
                    {
                        item.to === stellarKeys.accountId ?
                            <Text style={{ color: 'green' }}>RECEIVED</Text> :
                            <Text style={{ color: 'red' }}>SENT</Text>
                    }
                    <Text style={{ color: 'black' }}> {item.amount}</Text>
                    {
                        item.to === stellarKeys.accountId ?
                            <Text style={{ color: 'green' }}> from</Text> :
                            <Text style={{ color: 'red' }}> to</Text>
                    }
                    <Text style={{ color: 'black' }}> {truncate(item.to, { length: 20 })}</Text>
                </View>
            </ListItem>
        );
    }

    render() {
        const { payments } = this.props;
        return (
            <Container theme={myTheme}>
                <Header>
                    <Button transparent onPress={this.props.popRoute}>
                        <Icon name="ios-arrow-back" />
                    </Button>
                    <Title>Last transactions</Title>
                </Header>
                <Content style={styles.sidebar} >
                    {payments && <List foregroundColor={'white'} dataArray={payments} renderRow={this._renderRow} />}
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    payments: selectPaymentsWithContactName(),
    stellarKeys: selectCurrentStellarKeys(),
});

const mapDispatchToProps = (dispatch) => ({
    popRoute: () => dispatch(popRoute()),
});

export default connect(mapStateToProps, mapDispatchToProps)(History);
