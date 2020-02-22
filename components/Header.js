import React from 'react';
import { Header } from "react-native-elements";

export default function () {
  return (
    <Header
      centerComponent={{ text: "owoticon", 
        style: { color: 'white', fontSize: 29, fontFamily: "Menlo-Bold" } 
      }}
      containerStyle={{ backgroundColor: "#f7c0bc", height: 80 }} //#f7c0bc  #facbc8
    />
  )
}
