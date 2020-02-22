import React from "react";
import { Text, View, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { MOODS, styles } from "./util/HomeUtil";


export default function HomeScreen ({navigation}) {
  
  const squares = Object.keys(MOODS).map((mood, i) => (
    <ImageBackground key={i} source={MOODS[mood]} style={styles.imageBackground}>
      <TouchableOpacity onPress={ () => navigation.push("Mood", { name: mood }) }>
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

