import React, { Component } from 'react';
import AppNavigator from './AppNavigator';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showDownloadingModal: false,
            showInstalling: false,
            downloadProgress: 0,
        };
    }

    render() {
        return (
            <AppNavigator store={this.props.store} />
        );
    }
}

export default App;
