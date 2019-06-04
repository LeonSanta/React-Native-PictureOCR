/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {StyleSheet, View, ImageBackground, TouchableOpacity } from 'react-native';
import RNTextDetector from "react-native-text-detector";
import CameraRollPicker from 'react-native-camera-roll-picker';
import styles, { screenHeight, screenWidth } from "./styles";

export default class gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      selected: [],
      loading: false,
      image: null,
      error: null,
      visionResp: []
    };

    this.getSelectedImages = this.getSelectedImages.bind(this);
  }

  async getSelectedImages(images, current) {
    var num = images.length;
    this.setState({
      num: num,
      selected: images,
    });
    if (this.state.selected[0] != null) {
      this.setState(
        {
          image: this.state.selected[0].uri
        },
        () => {
          console.log(this.state.selected[0].uri);

          this.processImage(this.state.selected[0].uri, {
            height: this.state.selected[0].height,
            width: this.state.selected[0].width
          });
        }
      );
    }
    
  }

  processImage = async (uri, imageProperties) => {
    const visionResp = await RNTextDetector.detectFromUri(uri);
    console.log(visionResp);
    if (!(visionResp && visionResp.length > 0)) {
      throw "UNMATCHED";
    }
    this.setState({
      visionResp: this.mapVisionRespToScreen(visionResp, imageProperties)
    });
  };

  mapVisionRespToScreen = (visionResp, imageProperties) => {
    const IMAGE_TO_SCREEN_Y = screenHeight / imageProperties.height;
    const IMAGE_TO_SCREEN_X = screenWidth / imageProperties.width;

    

    console.log("image height = " + imageProperties.height);
    console.log("IMAGE_TO_SCREEN_Y = " + IMAGE_TO_SCREEN_Y);
    console.log("IMAGE_TO_SCREEN_X = " + IMAGE_TO_SCREEN_X);

    return visionResp.map(item => {
      return {
        ...item,
        position: {
          width: item.bounding.width * IMAGE_TO_SCREEN_X,
          left: item.bounding.left * IMAGE_TO_SCREEN_X,
          height: item.bounding.height * IMAGE_TO_SCREEN_Y,
          top: item.bounding.top * IMAGE_TO_SCREEN_Y
        }
      };
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
        </View>
        <CameraRollPicker
          groupTypes='SavedPhotos'
          assetType='Photos'
          maximum={1}
          selected={this.state.selected}
          imagesPerRow={3}
          imageMargin={5}
          callback={this.getSelectedImages} />
              {this.state.image ? (
          <ImageBackground
            source={{ uri: this.state.image }}
            style={styles.imageBackground}
            key="image"
            resizeMode="stretch"
          >
            {this.state.visionResp.map(item => {
              return (
                <TouchableOpacity
                  style={[styles.boundingRect, item.position]}
                  key={item.text}
                  onPress={() => (alert(item.text))}
                />

              );
            })}
          </ImageBackground>
        ) : null}
      </View>
    );
  }
}

gallery.navigationOptions = {
  title: 'React Native Text Detector gallery',
};
