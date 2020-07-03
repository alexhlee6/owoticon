import { StyleSheet } from 'react-native';


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
    height: 60, 
    justifyContent: "center", 
    alignItems: "center"
  },
  emoteBackground: {
    backgroundColor: "white",
    width: 175,
    height: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#facbc8",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },
  emoteText: {
    color: "gray",
    fontSize: 20
  },
  copiedText: {
    color: "#ffc6bd",
    fontSize: 20,
    position: "absolute",
    zIndex: 3,
    backgroundColor: "white",
    minWidth: "100%",
    maxWidth: "100%",
    minHeight: 20,
    textAlign: "center",
    paddingVertical: 5
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