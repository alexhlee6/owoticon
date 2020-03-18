import React from "react";
import { Text, View, Animated, Dimensions } from 'react-native';

class Menu extends React.Component {

  constructor(props) {
    super(props);
    this.springValue = new Animated.Value(0.3)
    this.state = { menuOpen: false, springValue: new Animated.Value(0.3) };
  }

  componentDidMount() {
    this.setState({ menuOpen: true });
    this.spring();
  }

  spring() {
    // this.springValue.setValue(0.3)
    Animated.spring(
      this.state.springValue,
      {
        // speed: 4,
        toValue: 1
        // toValue: 1,
        // friction: 1,
        // velocity: 1
      }
    ).start()
  }

  render() {
    return (
      // <View style={{ 
      //   position: "absolute", zIndex: 50, top: 0, bottom: 0, left: 0, right: 0,
      //   alignSelf: "flex-start",
      //   alignItems: "center", justifyContent: "center",
      //   backgroundColor: 'rgba(255, 255, 255, 0.3)'
      // }}>
        <Animated.View style={{
          width: 275, height: 200, backgroundColor: "white",
          transform: [{ scale: this.state.springValue }]
        }}>
          <Text>Menu</Text>
        </Animated.View>
      // </View>
    )
  }

}

export default Menu;