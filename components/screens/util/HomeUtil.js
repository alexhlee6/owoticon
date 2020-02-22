import { 
  Dimensions, StyleSheet
} from 'react-native';

export const MOODS = {
  "Happy": require("../../../assets/images/Happy.jpg"),
  "Sad": require("../../../assets/images/Sad.jpg"),
  "Love": require("../../../assets/images/Love.jpg"),
  "Funny": require("../../../assets/images/Funny.jpg"),
  "Angry": require("../../../assets/images/Angry.jpg"),
  "Surprise": require("../../../assets/images/Surprise.jpg"),
  "Shy": require("../../../assets/images/Shy.jpg"),
  "Neutral": require("../../../assets/images/Neutral.jpg"),
  "Friends": require("../../../assets/images/Friends.jpg"),
  "Animals": require("../../../assets/images/Animals.jpg")
}

export const getSquareWidth = () => {
  return (Dimensions.get("window").width / 2);
}

export const getSquareHeight = () => {
  return Dimensions.get("window").height / 4;
}

export const styles = StyleSheet.create({
  homeContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  moodSquare: {
    width: getSquareWidth(),
    height: getSquareHeight(),
    alignItems: "center",
    justifyContent: "center"
  },
  imageBackground: {
    width: getSquareWidth(),
    height: getSquareHeight()
  },
  imageText: {
    fontSize: 30,
    color: "white",
    fontFamily: "Menlo",
    textTransform: "uppercase",
    textShadowColor: '#c99895',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  }
});


