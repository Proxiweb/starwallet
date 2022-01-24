
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './configureStore';

const setup = () => {
    console.log('setup');
    class Root extends Component {

        constructor() {
            super();
            this.state = {
                isLoading: true,
                store: configureStore(() => this.setState({ isLoading: false })),
            };
        }

        render() {
            return (
                <Provider store={this.state.store}>
                    <App store={this.state.store} />
                </Provider>
            );
        }
    }
    return Root;
};

export default setup;
