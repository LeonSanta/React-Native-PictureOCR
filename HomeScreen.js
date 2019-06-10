/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { Button, Text, View } from 'react-native';
import styles from "./styles.js";

const HomeScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>React Native OCR</Text>

      <Button
        title="React Native Text Detector OCR"
        onPress={() => navigation.navigate('RNTextDetector')}
        style={styles.button}
      />
  </View>
);

export default HomeScreen;
