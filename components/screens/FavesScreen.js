import React from "react";
import { Text, View } from 'react-native';

import { connect } from 'react-redux';
import { getAllFaves } from '../../redux/actions/fave_actions';

const mSTP = (state, ownProps) => {
  
  return {

  }
}
const mDTP = (dispatch) => {
  return {
    getAllFaves: () => dispatch(getAllFaves())
  }
}

class FavesScreen extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.props.getAllFaves()
  }

  render() {
    return (
      <View>
        <Text>Faves</Text>
      </View>
    )
  }
}


export default connect(mSTP, mDTP)(FavesScreen);