import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  Pressable,
} from "react-native";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faImage, faCamera } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import axios from "axios";

library.add(faImage, faCamera);

const ImageClassificationScreen = () => {
  const [image, setImage] = useState(null);
  const [imageResized, setimageResized] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    setPrediction(null);
    setImage(null);
    setConfidence(null);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      resizeImage(result.assets[0].uri);
      sendImageToBackend(imageResized);
    }
  };
  const takeImage = async () => {
    setImage(null);
    setPrediction(null);
    setConfidence(null);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    console.log("ImagePicker result:", result);
    if (!result.canceled) {
      console.log("Captured image URI:", result.uri);
      setImage(result.assets[0].uri);

      resizeImage(result.assets[0].uri);
      sendImageToBackend(imageResized);
    }
  };
  const resizeImage = async (uri) => {
    try {
      const resizedImage = await ImageManipulator.manipulateAsync(uri, [
        { resize: { width: 256, height: 256 } },
      ]);
      console.log("Resized image URI:", resizedImage.uri);
      setimageResized(resizedImage.uri);
    } catch (error) {
      console.error("Error resizing image:", error);
    }
  };
  const sendImageToBackend = async (uri) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "image/jpeg",
        name: "photo.jpg",
      });

      const response = await axios.post(
        "https://api-88c0.onrender.com/predict",
        formData,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPrediction(response.data.class);
      setConfidence(response.data.confidence);
      console.log("predictedClass is ", response.data);
    } catch (error) {
      console.error("Error sending image to backend:", error);
      setPrediction(null);
      setConfidence(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearScreen = async () => {
    setConfidence(null);
    setPrediction(null);
    setIsLoading(null);
    setImage(null);
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {isLoading && <Text style={styles.loading}>Predicting...</Text>}
      {prediction && !isLoading && (
        <View style={styles.mainOuter}>
          <Text style={[styles.space, styles.labelText]}>
            {"Label: \n"}
            <Text style={styles.resultText}>{prediction}</Text>
          </Text>
          <Text style={[styles.space, styles.labelText]}>
            {"Confidence: \n"}
            <Text style={styles.resultText}>{confidence + "%"}</Text>
          </Text>
        </View>
      )}
      <View>
        {!prediction && !isLoading && (
          <Text style={styles.chooseImage}>
            {"Use below buttons to select a picture of a potato plant leaf"}
          </Text>
        )}
      </View>
      <View style={styles.content}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <FontAwesomeIcon icon={faImage} size={35} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clearScreen}>
          <FontAwesomeIcon icon={faTimes} size={35} color="#808080" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={takeImage}>
          <FontAwesomeIcon icon={faCamera} size={35} color="#808080" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    position: "relative",
  },
  space: { marginVertical: 10, marginHorizontal: 10 },
  labelText: { color: "#FFF", fontSize: 20, fontWeight: "bold" },
  chooseImage: {
    position: "absolute",
    color: "#FFF",
    fontSize: 20,
    fontWeight: "600",
    alignSelf: "center",
    bottom: 60,
    margin: 25,
    textAlign: "center",
  },
  resultText: { fontSize: 32, fontWeight: "bold" },
  mainOuter: {
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
    top: 500,
    alignSelf: "center",
  },
  predictionContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: 300,
    left: 36,
    marginTop: 20,
  },
  loading: {
    position: "absolute",
    top: 460,
    left: 138,
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  response: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  image: {
    width: 256,
    height: 256,
    marginBottom: 220,
    left: 67,
    borderRadius: 15,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 100,
  },
  button: {
    backgroundColor: "beige",
    padding: 10,
    borderRadius: 8,
  },
  buttonClear: {
    position: "absolute",
    bottom: 30,
    backgroundColor: "beige",
    padding: 10,
    borderRadius: 8,
  },
});

export default ImageClassificationScreen;
