import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Content, Text, List, ListItem, Container, Header, Button, Icon, Title, Card, CardItem } from 'native-base';
import { createStructuredSelector } from 'reselect';
import truncate from 'lodash.truncate';

import { selectContacts } from '../../selectors';
import { closeDrawer } from '../../actions/drawer';
import { popRoute, pushNewRoute } from '../../actions/route';
import myTheme from '../../themes/base-theme';
import styles from './styles';

class Contacts extends Component {
    static propTypes = {
        contacts: PropTypes.array.isRequired,
        closeDrawer: PropTypes.func.isRequired,
        popRoute: PropTypes.func.isRequired,
        pushNewRoute: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this._navigateTo = this._navigateTo.bind(this);
        this._edit = this._edit.bind(this);
    }

    _navigateTo(route, passProps) {
        this.props.pushNewRoute(route, passProps);
    }

    _edit(contact) {
        this.props.pushNewRoute('contact_edit', { contact });
    }

    render() {
        const { contacts } = this.props;
        return (
            <Container theme={myTheme}>
                <Header>
                    <Button transparent onPress={this.props.popRoute}>
                        <Icon name="ios-arrow-back" />
                    </Button>
                    <Title>Contacts</Title>
                </Header>
                <Content style={styles.sidebar} >
                    {!contacts || contacts.length === 0 &&
                        <Card>
                            <CardItem>
                                <Text>No contact in contact list. Contacts are added automatically when payments succeeded.</Text>
                            </CardItem>
                        </Card>
                    }
                    {contacts && contacts.length > 0 &&
                        <List foregroundColor={'white'}>
                            {this.props.contacts.map((contact, idx) => (
                                <ListItem iconRight button key={idx} onPress={() => this._navigateTo('payment', { accountId: contact.accountId })}>
                                    <Text onLongPress={() => this._edit(contact)} style={{ color: 'gray' }}>{contact.name || truncate(contact.accountId)}</Text>
                                    <Icon name="ios-send" style={{ color: 'gray' }}/>
                                </ListItem>
                            ))}
                        </List>
                    }
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = createStructuredSelector({
    contacts: selectContacts(),
});

const mapDispatchToProps = (dispatch) => ({
    closeDrawer: () => dispatch(closeDrawer()),
    popRoute: () => dispatch(popRoute()),
    pushNewRoute: (route, passProps) => dispatch(pushNewRoute(route, passProps)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
