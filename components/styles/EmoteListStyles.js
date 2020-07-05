import { StyleSheet } from 'react-native';
import { hide } from 'expo/build/launch/SplashScreen';


export default StyleSheet.create({
  main: {
    flex: 1,
    height: "100%",
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  emoteContainer: {
    width: "50%", 
    height: 65, 
    justifyContent: "center", 
    alignItems: "center"
  },
  emoteBackground: {
    backgroundColor: "white",
    width: 175,
    height: 55,
    paddingHorizontal: 25,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#facbc8",
    // borderColor: "#ffd0cc",
    // borderColor: "#ffdedb",
    borderColor: "#ffd4d1",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  emoteText: {
    color: "gray",
    color: "#717171",
    fontSize: 19,
    textAlign: "center"
  },
  copiedText: {
    color: "#ffc6bd",
    fontSize: 19,
    position: "absolute",
    zIndex: 3,
    backgroundColor: "white",
    minWidth: "100%",
    width: 170,
    minHeight: 20,
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 5
  },
  favoriteButton: {
    width: 35, 
    height: 35,
    borderRadius: 50, 
    zIndex: 5,
    backgroundColor: "white",
    borderColor: "#fcddd9", 
    borderWidth: 1.5,
    justifyContent: "center", 
    alignItems: "center",
    position: "absolute", 
    bottom: 20
  }
});