import React from "react";
import { ImageBackground, StyleSheet, Text } from "react-native";
import ImageClassificationScreen from "./ImageClassificationScreen";

const App = () => {
  return (
    <ImageBackground
      source={require("./assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
      blurRadius={10}
    >
      <Text style={styles.title}>{"Potato Disease \nPrediction App"}</Text>
      <ImageClassificationScreen />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  title: {
    alignSelf: "center",
    position: "absolute",
    top: 55,
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
});

export default App;
