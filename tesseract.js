/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  StyleSheet,
  PixelRatio
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import RNTesseractOcr from 'react-native-tesseract-ocr';

const Button = (Platform.OS === 'android') ? TouchableNativeFeedback : TouchableOpacity;
const imagePickerOptions = {
  quality: 1.0,
  maxWidth: 500,
  maxHeight: 500,
  storageOptions: {
    skipBackup: true,
  },
};
const tessOptions = {
  whitelist: null,
  blacklist: null,
};
var language = 'LANG_ENGLISH';

export default class ImagePickerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: null,
      extractedText: null,
      hasErrored: false,
      imageSource: null,
      isLoading: false,
    };
    this.selectImage = this.selectImage.bind(this);
  }

  selectImage() {
    this.setState({ isLoading: true });

    ImagePicker.showImagePicker(imagePickerOptions, (response) => {
      if (response.didCancel) {
        this.setState({ isLoading: false });
      } else if (response.error) {
        this.setState({ isLoading: false, hasErrored: true, errorMessage: response.error });
      } else {
        const source = { uri: response.uri };
        this.setState({ imageSource: source, hasErrored: false, errorMessage: null }, this.extractTextFromImage(response.path));
      }
    });
  }


  setLanguage(language) {
    this.language = language;
    alert(this.language);
  }

  extractTextFromImage(imagePath) {
    console.log(this.language);
    RNTesseractOcr.recognize(imagePath, this.language, tessOptions)
      .then((result) => {
        this.setState({ isLoading: false, extractedText: result });
        
      })
      .catch((err) => {
        this.setState({ hasErrored: true, errorMessage: err.message });
      });
  }

  render() {
    const { errorMessage, extractedText, hasErrored, imageSource, isLoading } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.button}>
          <Button
            onPress={() => this.setLanguage('LANG_CHINESE_TRADITIONAL')}
            style={styles.button}
          >
            <Text>
              Chinese
            </Text>
          </Button>
        </View>
        <View style={styles.button}>
          <Button
            title="English"
            onPress={() => this.setLanguage('LANG_ENGLISH')}
            style={styles.button}
          >
            <Text>
              English
            </Text>
          </Button>
        </View>
        <Button onPress={this.selectImage} >
          <View style={[styles.image, styles.imageContainer, !imageSource && styles.rounded]}>
            {
              imageSource === null
                ? <Text>Tap me!</Text>
                : <Image style={styles.image} source={imageSource} />
            }
          </View>
        </Button>

        {
          isLoading
            ? <ActivityIndicator size="large" />
            : (
              hasErrored
                ? <Text>{errorMessage}</Text>
                : <Text>{extractedText}</Text>
            )
        }

      </View>

    );
  }
}

ImagePickerScreen.navigationOptions = {
  title: 'Image Picker Example',
};

const styles = StyleSheet.create({
  button: {
    margin: 5,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
  },
  imageContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  image: {
    width: 200,
    height: 200,
  },
  rounded: {
    borderRadius: 75,
  }
});

