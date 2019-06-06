/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { StyleSheet, View, ImageBackground, TouchableOpacity } from 'react-native';
import RNTextDetector from "react-native-text-detector";
import CameraRollPicker from 'react-native-camera-roll-picker';
import styles, { screenHeight, screenWidth } from "./styles";
import cloneDeep from 'lodash/cloneDeep';

export default class gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
      selected: [],
      loading: false,
      image: null,
      error: null,
      visionResp: [],
      eachLine: [],
      newVisionResp: [],
      selectResult: [],
      toggle: true,
    }
    this.getSelectedImages = this.getSelectedImages.bind(this);
  }

  reset(error = "OTHER") {
    this.setState(
      {
        loading: false,
        image: null,
        error
      },
      () => {
        // setTimeout(() => this.camera.startPreview(), 500);
      }
    );
  }


  async getSelectedImages(images, current) {
    var num = images.length;
    this.setState({
      num: num,
      selected: images,
      loading: true
    });
    try {
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
    } catch (e) {
      console.warn(e);
      this.reset(e);
    }
  }

  processImage = async (uri, imageProperties) => {
    visionResp = await RNTextDetector.detectFromUri(uri);
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
    console.log("123123");
    for (let i = 0; i < visionResp.length; i++) {
      if (visionResp[i].text.includes('\n')) {
        newvisionResp = cloneDeep(visionResp);
        var lineCount = 1;
        var lineCountForHeight = 1;
        while (visionResp[i].text.includes('\n')) {
          visionResp[i].text = visionResp[i].text.replace("\n", "");
          lineCountForHeight++;
        }
         
        visionResp[i].text = newvisionResp[i].text.substring(0, (newvisionResp[i].text.indexOf('\n')));
        while (newvisionResp[i].text.includes('\n')) {
         
          newvisionResp[i].text = newvisionResp[i].text.replace("\n", "$");
          if ((newvisionResp[i].text.substring(0, ((newvisionResp[i].text.indexOf('$'))))) != visionResp[i].text) {
            this.setState(prevState => ({
              eachLine: [...prevState.eachLine, { text: (newvisionResp[i].text.substring(0, (newvisionResp[i].text.indexOf('$')))), bounding: { height: (visionResp[i].bounding.height / lineCountForHeight), width: (visionResp[i].bounding.width), left: (visionResp[i].bounding.left), top: ((visionResp[i].bounding.top) + ((lineCount - 1) * ((visionResp[i].bounding.height) / lineCountForHeight))) } }]
            }));
          }

          newvisionResp[i].text = newvisionResp[i].text.replace((newvisionResp[i].text.substring(0, (newvisionResp[i].text.indexOf('$') + 1))), "");
          lineCount++;

        }
        this.setState(prevState => ({
          eachLine: [...prevState.eachLine, { text: (newvisionResp[i].text), bounding: { height: (visionResp[i].bounding.height / lineCountForHeight), width: (visionResp[i].bounding.width), left: (visionResp[i].bounding.left), top: ((visionResp[i].bounding.top) + ((lineCount - 1) * ((visionResp[i].bounding.height) / lineCountForHeight))) } }]
        }));
        visionResp[i].bounding.height = visionResp[i].bounding.height / lineCountForHeight;

      }
    };
    visionResp = this.state.eachLine.concat(visionResp);
    

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

  ToggleFunction = async (inputString, position) => {
    console.log("position = " + position);
    this.setState(state => ({
      toggle: !state.toggle,
    }));
    if (this.state.toggle) {
      console.log("selectResult = if");
      await this.setState(prevState => ({
        selectResult: [...prevState.selectResult, inputString]
      }));
      
    } else {
      console.log("selectResult = else");

      var array = [...this.state.selectResult]; 
      var index = array.indexOf(inputString);
      console.log("index = " + index);
      if (index != -1) {
        array.splice(index, 1);
        await this.setState({selectResult: array});
      };
      
    }
    console.log("selectResult" , this.state.selectResult, "inputString", inputString);
  };

  render() {
    return (
      <View style={styles.screen}>
        {!this.state.image ? (
          <CameraRollPicker
            groupTypes='SavedPhotos'
            assetType='Photos'
            maximum={1}
            selected={this.state.selected}
            imagesPerRow={3}
            imageMargin={5}
            callback={this.getSelectedImages}>
          </CameraRollPicker>
        ) : null}
        {this.state.image ? (
          <ImageBackground
            source={{ uri: this.state.image }}
            style={styles.imageBackground}
            key="image"
            resizeMode="cover"
          >
            {this.state.visionResp.map(item => {
              return (
                <TouchableOpacity
                  style={[style.boundingRect, item.position]}
                  key={item.text + item.bounding.top + item.bounding.left}
                  onPress={() => (this.ToggleFunction(item.text, item.position))}
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
