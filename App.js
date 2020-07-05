import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppLoading } from "expo";
import { Asset } from 'expo-asset';
import { View, Dimensions, Text, Image } from "react-native";
import * as Font from 'expo-font';
import { FontAwesome } from '@expo/vector-icons';

// Redux:
import { Provider } from 'react-redux';
import configureStore from './redux/store/store';
const store = configureStore();

// Components:
import Header from "./components/Header";
import MainNav from "./components/navs/MainNav.js";

import { configureFavesOnInit } from './redux/util/storage_util';

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
function cacheFonts(fonts) {
  return fonts.map(font => Font.loadAsync(font));
}

export default class App extends React.Component {

  state = {
    isReady: false
  }

  async _cacheResourcesAsync() {
    const images = [
      require('./assets/icon.png'),
      require('./assets/images/heart.png'),
      require('./assets/images/heart-o.png'),
    ];
    const fontAssets = cacheFonts([FontAwesome.font]);

    const imageAssets = cacheImages(images);
    await Promise.all([...imageAssets, ...fontAssets]);
  }

  configureFaves = () => {
    configureFavesOnInit();
    this.setState({ isReady: true });
  }


  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._cacheResourcesAsync}
          onFinish={this.configureFaves}
          onError={console.warn}
        />
      );
    }
    return (
      <Provider store={ store }>
        <NavigationContainer>
          <View style={{
            height: Dimensions.get("window").height, position: "relative", 
            flex: 1, justifyContent: "center"
          }}>
            <Header />
            <MainNav />
          </View>
        </NavigationContainer>
      </Provider>
    );
  }
}
