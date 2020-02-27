import { StyleSheet, Dimensions } from 'react-native';

import Angry from "./emotes/Angry";
import Animals from "./emotes/Animals";
import Friends from "./emotes/Friends";
import Funny from "./emotes/Funny";
import Happy from "./emotes/Happy";
import Love from "./emotes/Love";
import Neutral from "./emotes/Neutral";
import Sad from "./emotes/Sad";
import Shy from "./emotes/Shy";
import Surprise from "./emotes/Surprise";

export const EMOTES = {
  Angry, Animals, Friends, Funny, Happy, Love, Neutral, Sad, Shy, Surprise
}

export const getEmoteWidth = () => {
  return (Dimensions.get("window").width / 2) - 30;
}

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15
  },
  emoteBackground: {
    backgroundColor: "white",
    width: getEmoteWidth(),
    height: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#facbc8",
    alignItems: "center",
    justifyContent: "center"
  },
  emoteText: {
    color: "gray",
    fontSize: 20
  },
  copiedText: {
    color: "lightpink",
    fontSize: 20,
    position: "absolute",
    zIndex: 3,
    backgroundColor: "white",
    minWidth: "100%",
    maxWidth: "100%",
    minHeight: 20,
    textAlign: "center",
    paddingVertical: 5
  }
});