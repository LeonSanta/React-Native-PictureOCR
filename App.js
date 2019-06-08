/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import { createStackNavigator, createAppContainer } from 'react-navigation';
import HomeScreen from './HomeScreen';
import RNTextDetector from './RNTextDetector';
import Camera from './camera';
import gallery from './gallery';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    RNTextDetector: RNTextDetector,
    Camera: Camera,
    gallery: gallery,
  },
  {
    initialRouteName: 'Home'
  }
);

export default createAppContainer(AppNavigator);