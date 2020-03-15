import React from 'react';
import { Header } from "react-native-elements";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function () {
  return (
    <Header
      centerComponent={{ text: "owoticon", 
        style: { color: 'white', fontSize: 29, fontFamily: "Menlo-Bold" } 
      }}
      // rightComponent={<Icon name="heart" color="white" size={22} />}
      // rightContainerStyle={{ paddingRight: 10 }}
      containerStyle={{ backgroundColor: "#f7c0bc", height: 80 }} //#f7c0bc  #facbc8
      // centerContainerStyle={{ paddingLeft: 10 }}
    />
  )
}
