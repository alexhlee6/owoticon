import React from "react";
import { Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import FavesScreen from "../screens/FavesScreen";

const Stack = createStackNavigator();

export default () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Favorites" component={FavesScreen} options={styles.options} />
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