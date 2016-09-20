
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Container, Content, Header, Title, InputGroup, Button, Icon, View, Input, Spinner, Grid, Row, Text } from 'native-base';

import { openDrawer } from '../../actions/drawer';
import { saveContact, deleteContact } from '../../actions/stellar';
import { replaceRoute, popRoute } from '../../actions/route';
import myTheme from '../../themes/base-theme';
import styles from './styles';


class ContactEdit extends Component {
    static propTypes = {
        navigator: PropTypes.object.isRequired,
        replaceRoute: PropTypes.func.isRequired,
        popRoute: PropTypes.func.isRequired,
        saveContact: PropTypes.func.isRequired,
        deleteContact: PropTypes.func.isRequired,
    }

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            name: null,
            accountId: null,
            fedId: null,
            pendingMessage: null,
        };
        this._handlePress = this._handlePress.bind(this);
        this._deleteContact = this._deleteContact.bind(this);
        this._replaceRoute = this._replaceRoute.bind(this);
        this._nameChanged = this._nameChanged.bind(this);
    }

    componentWillMount() {
        const routes = this.props.navigator.getCurrentRoutes();
        const contact = routes[routes.length - 1] && routes[routes.length - 1].passProps ? routes[routes.length - 1].passProps.contact : null;
        if (contact) {
            this.setState({ ...contact });
        } else {
            this.setState({ error: 'Contact non trouvé' });
        }
    }

    _nameChanged(e) {
        this.setState({
            ...this.state,
            name: e.nativeEvent.text,
        });
    }

    _deleteContact() {
        if (this.state.accountId) {
            this.props.deleteContact(this.state.accountId);
        }
    }

    _replaceRoute(route) {
        this.props.replaceRoute(route);
    }

    _handlePress() {
        const { name, accountId, fedId, env } = this.state;
        this.props.saveContact({ name, accountId, fedId, env });
    }

    render() {
        const { name, accountId, fedId, error, pendingMessage } = this.state;  // eslint-disable-line

        return (
            <Container theme={myTheme}>
                <Header>
                    <Button transparent onPress={this.props.popRoute}>
                        <Icon name="ios-arrow-back" />
                    </Button>
                    <Title>Edit contact</Title>
                </Header>

                <Content>
                    <View style={styles.bg}>
                        <Grid>
                            <Row size={1}>
                                {!error && pendingMessage && <View style={styles.spinnerArea}>
                                    <Spinner color="gray" />
                                    <Text>{pendingMessage}</Text>
                                </View>}
                            </Row>
                            <Row size={3}>
                                {!this.state.paid && <View style={styles.formArea}>
                                    <InputGroup style={styles.input}>
                                        <Icon name="ios-person" />
                                        <Input
                                            placeholder="Name of the contact"
                                            autoCorrect={false}
                                            placeholderTextColor="gray"
                                            onChange={this._nameChanged}
                                            defaultValue={name}
                                        />
                                    </InputGroup>
                                    <InputGroup style={styles.input} disabled>
                                        <Icon name="ios-checkmark" style={{ color: 'gray' }} />
                                        <Input
                                            placeholder="accountId"
                                            placeholderTextColor="gray"
                                            autoCorrect={false}
                                            value={accountId}
                                        />
                                    </InputGroup>
                                </View>}
                            </Row>
                            <Row size={2}>
                                <View style={styles.submitArea}>
                                    <View style={{ backgroundColor: 'white' }}>
                                        {<Button primary textStyle={{ color: 'white' }} style={styles.button} onPress={this._handlePress}>
                                            <Icon name="ios-checkmark" style={{ color: 'black' }}/>
                                            Save Contact
                                        </Button>}
                                    </View>
                                    <View style={{ backgroundColor: 'white' }}>
                                        {<Button danger style={styles.button} onPress={this._deleteContact}>
                                            <Icon name="ios-trash" style={{ color: 'black' }}/>
                                            Delete contact
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

const mapDispatchToProps = (dispatch) => (
    {
        replaceRoute: (route) => dispatch(replaceRoute(route)),
        popRoute: () => dispatch(popRoute()),
        openDrawer: () => dispatch(openDrawer()),
        saveContact: (contact) => dispatch(saveContact(contact)),
        deleteContact: (contact) => dispatch(deleteContact(contact)),
    }
);

export default connect(null, mapDispatchToProps)(ContactEdit);
