import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppLoading } from "expo";
import { Asset } from 'expo-asset';
import { View, Dimensions } from "react-native";

import Header from "./components/Header";
import MainNav from "./components/navs/MainNav.js";


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
          <View style={{
            height: Dimensions.get("window").height, position: "relative", 
            flex: 1, justifyContent: "center"
          }}>
            <Header />
            <MainNav />
          </View>
        </NavigationContainer>
    );
  }
}
