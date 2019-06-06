/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export default class RNTextDetectorHomeScreen extends Component {
  state = {
    imageText: []
  }
  render() {
    const imageText = this.props.navigation.getParam('text', '');
    console.log("imageText = ", imageText[0]);
    var result = "";
    for (let i =0 ; i < imageText.length ; i++) {
      result = result + imageText[i] + '\n';
    }
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Home Screen</Text>
        <TextInput
          style={{ height: 300, borderColor: 'gray', borderWidth: 1, width: 250 }}
          onChangeText={(imageText) => this.setState({ imageText })}
          value={result} 
          multiline = {true}/>

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
