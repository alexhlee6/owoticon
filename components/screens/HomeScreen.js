import React from "react";
import { Text, View, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';
import { MOODS, styles } from "./util/HomeUtil";

import { connect } from 'react-redux';
import { getAllFaves } from '../../redux/actions/fave_actions';

const mSTP = (state, ownProps) => {
  return {
    faves: state.faves
  }
}
const mDTP = (dispatch) => {
  return {
    getAllFaves: () => dispatch(getAllFaves())
  }
}

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      faves: props.faves
    }
  }
  
  componentDidMount() {
    this.props.getAllFaves().then(() => this.setState({faves: this.props.faves}));
  }

  componentDidUpdate() {
    
  }

  render() {
    const squares = Object.keys(MOODS).map((mood, i) => (
      <ImageBackground key={i} source={MOODS[mood]} style={styles.imageBackground}>
        <TouchableOpacity onPress={ () => this.props.navigation.push("Mood", { name: mood }) }>
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
    )
  }
}

export default connect(mSTP, mDTP)(HomeScreen);
