import React from 'react';
import { Header } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function () {
  return (
    <Header
      centerComponent={{ text: "owoticon", 
        style: { color: 'white', fontSize: 29, fontFamily: "Menlo-Bold" } 
      }}
      // containerStyle={{ backgroundColor: "#f7c0bc", height: 80 }} //#f7c0bc  #facbc8
      containerStyle={{ backgroundColor: "#ffc3bf", height: 80 }} //#f7c0bc  #facbc8
    />
  )
}
