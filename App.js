import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { AppLoading } from "expo";
import { Asset } from 'expo-asset';

import DrawerContent from "./components/DrawerContent";
import Header from "./components/Header";
import HomeScreen from "./components/screens/HomeScreen";
import MoodScreen from "./components/screens/MoodScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default class App extends React.Component {
  state = {
    isReady: false
  }

  async _cacheResourcesAsync() {
    const images = [require('./assets/icon.png')];

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });
    return Promise.all(cacheImages);
  }

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }
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