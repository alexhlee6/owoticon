import React from "react";
import { Text, View, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { MOODS, styles } from "./util/HomeUtil";


export default function HomeScreen (props) {
  // console.log(props);
  const {navigation, toggleMenu} = props;
  const squares = Object.keys(MOODS).map((mood, i) => (
    <ImageBackground key={i} source={MOODS[mood]} style={styles.imageBackground}>
      <TouchableOpacity onPress={ () => navigation.push("Mood", { name: mood, toggleMenu }) }>
      <View style={styles.moodSquare}>
        <Text style={styles.imageText}>{ mood }</Text>
      </View>
      </TouchableOpacity>
    </ImageBackground>
  ));

  return (
    <ScrollView>
      <View style={ styles.homeContainer }>
        { squares }
      </View>
    </ScrollView>
  );
}

