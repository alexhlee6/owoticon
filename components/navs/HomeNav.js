import React from "react";
import HomeScreen from "../screens/HomeScreen";
import MoodScreen from "../screens/MoodScreen";
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={ styles.options
        // Object.assign({}, styles.options, {headerShown: false})
      } 
        
      />
      <Stack.Screen name="Mood" component={MoodScreen} options={styles.options} />
    </Stack.Navigator>
  )
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
  }
};