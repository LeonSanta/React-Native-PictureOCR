/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import firebase from 'react-native-firebase';
import React, { Component } from 'react';
import { View, ImageBackground, TouchableOpacity, Button, ToastAndroid, Alert, SafeAreaView, Platform} from 'react-native';
import RNTextDetector from "react-native-text-detector";
import CameraRollPicker from 'react-native-camera-roll-picker';
import styles, { screenHeight, screenWidth } from "./styles";
import cloneDeep from 'lodash/cloneDeep';

export default class gallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: [],
      loading: false,
      image: null,
      visionResp: [],
      eachLine: [],
      newVisionResp: [],
      selectResult: []
    }
    this.getSelectedImages = this.getSelectedImages.bind(this);
  }


  reset(error = "OTHER") {
    this.setState(
      {
        loading: false,
        image: null
      }
    );
  }

  async getSelectedImages(images) {
    this.setState({
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
    }
    visionResp = this.state.eachLine.concat(visionResp);
    console.log(visionResp);
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

  alertText = async (selectText) => {
    await Alert.alert('text', selectText,
      [
        { text: 'Cancel' },
        {
          text: 'Ok', onPress: () => this.props.navigation.navigate('RNTextDetector', {
            text: selectText
          }),
        },
      ],
      { cancelable: false },
    );
    console.log("selectText", selectText);
  }

  ToggleFunction = async (inputString) => {
    var array = [...this.state.selectResult];
    var index = array.indexOf(inputString);
    if (index !== -1) {
      array.splice(index, 1);
      await this.setState({ selectResult: array });
      await ToastAndroid.show(inputString + "\n Has removed from result", ToastAndroid.SHORT);
    }
    else {
      await this.setState(prevState => ({
        selectResult: [...prevState.selectResult, inputString]
      }));
      await ToastAndroid.show(inputString + "\n Has Add to result", ToastAndroid.SHORT);
    };
    console.log("selectResult", this.state.selectResult);
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>

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
              resizeMode="stretch"
            >
              {this.state.visionResp.map(item => {
                return (
                  <TouchableOpacity
                    style={[styles.boundingRect, item.position]}
                    key={item.text + item.bounding.top + item.bounding.left}
                    onPress={() => (this.ToggleFunction(item.text))} //for muti selection
                  //onPress={() => (this.alertText(item.text))}
                  />

                );
              })}
            </ImageBackground>
          ) : null}
        </View>
      </SafeAreaView>
    );
  }

  componentWillMount() {
    this.props.navigation.setParams({ submitSelect: this.submitSelect });
  }
  
  componentDidMount() {
    const unitId =
      Platform.OS === 'ios'
        ? 'ca-app-pub-6806282339237533/7962615966'
        : 'ca-app-pub-6806282339237533/7962615966';
    const advert = firebase.admob().interstitial(unitId);
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();
    advert.loadAd(request.build());
  
    advert.on('onAdLoaded', () => {
      console.log('Advert ready to show.');
      advert.show();
    });
  }

  submitSelect = () => {
    this.props.navigation.navigate('RNTextDetector', {
      text: this.state.selectResult
    });
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "React Native Text Detector camera",
      headerRight: (
        <Button
          onPress={navigation.getParam('submitSelect')}
          title="submit">
        </Button>
      ),
    };
  };
}