/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {Text, View, Button } from 'react-native';

export default class RNTextDetectorHomeScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <Button
          title="open camera"
          onPress={() => this.props.navigation.navigate('Camera')}
        />
        <Button
          title="open gallery"
          onPress={() => this.props.navigation.navigate('gallery')}
        />
      </View>
    );
  }
}

RNTextDetectorHomeScreen.navigationOptions = {
  title: 'React Native Text Detector',
};
