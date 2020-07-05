import React from "react";
import HomeScreen from "../screens/HomeScreen";
import MoodScreen from "../screens/MoodScreen";
import { createStackNavigator } from '@react-navigation/stack';
import { View, Button } from "react-native";
const Stack = createStackNavigator();



export default () => {
 
  return (
    <View style={{height: "100%", width: "100%"}}>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={ styles.options } />
      <Stack.Screen name="Mood" component={MoodScreen} options={ styles.moodOptions }
       />
    </Stack.Navigator>
    </View>
  );
}


const styles = {
  options: {
    headerStyle: {
      backgroundColor: "white"
    },
    headerTitleStyle: {
      color: "#facbc8"
    },
    headerTintColor: "#fcddd9"
  },
  moodOptions: {
    headerStyle: {
      backgroundColor: "white"
    },
    headerTitleStyle: {
      color: "#facbc8"
    },
    headerTintColor: "#fcddd9",
    gestureResponseDistance: {
      horizontal: 300
    },
    gestureVelocityImpact: 0.2
  }
};