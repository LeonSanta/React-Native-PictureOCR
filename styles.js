
import { StyleSheet } from "react-native";

import Colors from "./theme/Colors";
import Dimensions from "./theme/Dimensions";
export const screenHeight = Dimensions.screenHeight;
export const screenWidth = Dimensions.screenWidth;
const styles = StyleSheet.create({
  screen: {
    backgroundColor: Colors.black,
    flex: 1
  },
  camera: {
    position: "absolute",
    width: screenWidth,
    height: screenHeight,
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0,
    flex: 1
  },
  imageBackground: {
    position: "absolute",
    width: screenWidth,
    height: screenHeight,
    alignItems: "center",
    justifyContent: "center",
    top: 0,
    left: 0
  },
  buttonContainer: {
    width: 70,
    height: 70,
    backgroundColor: Colors.white,
    borderRadius: 35,
    position: "absolute",
    bottom: 80,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center"
  },
  circle: {
    width: 64,
    height: 64,
    backgroundColor: Colors.white,
    borderRadius: 32,
    borderWidth: 4,
    borderColor: Colors.black
  },
  boundingRect: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.75,
    borderColor: "#FF6600"
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignSelf: 'center',
    alignItems: 'center', 
    justifyContent: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10
  },
  ad: {
    position: 'absolute',
    bottom:0
  }
});

export default styles;