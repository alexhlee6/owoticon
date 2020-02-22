import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';

import DrawerContent from "./components/DrawerContent";
import Header from "./components/Header";
import HomeScreen from "./components/screens/HomeScreen";
import MoodScreen from "./components/screens/MoodScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App(props) {
  return (
    <NavigationContainer>
      <Header />

      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={styles.options} />
        <Stack.Screen name="Mood" component={MoodScreen} options={styles.options} />
      </Stack.Navigator>

    </NavigationContainer>
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
  }
};