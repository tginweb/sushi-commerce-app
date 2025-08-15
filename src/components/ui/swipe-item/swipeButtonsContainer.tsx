// @flow
import React from 'react';
import { Animated } from 'react-native';

type Props = {
    children?: any,
    style?: any,
};

export default class SwipeButtonsContainer extends React.Component<Props> {
    render() {
        const { style, children, ...other } = this.props;

        return (
            <Animated.View {...other} style={style}>
                {children}
            </Animated.View>
        );
    }
}
