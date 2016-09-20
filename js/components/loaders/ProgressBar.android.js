/* @flow */


import React from 'react';
import { ActivityIndicatorIOS, Platform } from 'react-native';
import ProgressBar from "ProgressBarAndroid";
import NativeBaseComponent from 'native-base/Components/Base/NativeBaseComponent';
import computeProps from 'native-base/Utils/computeProps';


export default class SpinnerNB extends NativeBaseComponent {

    prepareRootProps() {

        var type = {
            height: 40
        }

        var defaultProps = {
            style: type
        }

        return computeProps(this.props, defaultProps);

    }


    render() {
        return(
           <ProgressBar  {...this.prepareRootProps()} styleAttr = "Horizontal"
                                                    indeterminate = {false} progress={this.props.progress ? this.props.progress/100 : 0.5}
                                                    color={this.props.color ? this.props.color : this.props.inverse ? this.getTheme().inverseProgressColor :
                                                      this.getTheme().defaultProgressColor}  />
        );
    }

}
