import { connect } from 'react-redux';
import { getAllFaves, addFave, deleteFave, updateFaveOrder } from '../../../redux/actions/fave_actions';

const mSTP = (state, ownProps) => {
  return {
    faves: state.faves.faves,
    favesPos: state.faves.favesPos
  }
}
const mDTP = (dispatch) => {
  return {
    getAllFaves: () => dispatch(getAllFaves()),
    addFave: (key, val) => dispatch(addFave(key, val)),
    deleteFave: (faveKey) => dispatch(deleteFave(faveKey)),
    updateFaveOrder: (favesPos) => dispatch(updateFaveOrder(favesPos))
  }
}

import React from "react";
import { 
  ScrollView, Text, View, Clipboard, TouchableWithoutFeedback, TouchableOpacity, Share, StyleSheet, Button
} from 'react-native';

import { DraggableGrid } from 'react-native-draggable-grid';
import Modal from 'react-native-modal';


const styling = StyleSheet.create({
  button:{
    width:150,
    height:100,
    backgroundColor:'blue',
  },
  item:styles.emoteBackground,
  item_text:styles.emoteText,
});

import styles from '../../styles/EmoteListStyles';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import * as Haptics from 'expo-haptics';

class FavesListDraggable extends React.Component {
  constructor(props) {
    super(props);
    
    let orderedFaves = [];
    props.favesPos.forEach(key => {
      orderedFaves.push({ key, text: props.faves[key] })
    });

    this.state = {
      justTouched: "",
      justLongPressed: "",
      menuOpen: false,
      editing: false,
      faves: props.faves,
      favesPos: props.favesPos,
      orderedFaves,
      isModalVisible: false
    }
  }

  componentDidMount() {
 
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      let orderedFaves = [];
      this.props.favesPos.forEach(key => {
        orderedFaves.push({ key, text: this.props.faves[key] })
      });
      this.setState({
        faves: this.props.faves,
        favesPos: this.props.favesPos,
        orderedFaves
      });
    }
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  addToFaves = (key, str) => {
    return () => {
      this.props.addFave(key, str)
        .then(() => this.setState({ faves: this.props.faves, favesPos: this.props.favesPos }));
    }
  }

  removeFromFaves = (key) => {
    return () => {
      this.props.deleteFave(key)
        .then(() => this.setState({ faves: this.props.faves, favesPos: this.props.favesPos }));
    }
  }

  saveFavesOrder = (newOrderedFaves) => {
    let newFavesPos = [];
    newOrderedFaves.forEach(item => {
      newFavesPos.push(item.key);
    });
    this.props.updateFaveOrder(newFavesPos);
  }


  renderItem = (item) => {
    const buttonStyle = Object.assign({}, styles.favoriteButton);
    buttonStyle.right = -5;
    buttonStyle.backgroundColor = "#fcddd9";
    buttonStyle.width = 26;
    buttonStyle.height = 26;
    buttonStyle.bottom = 29;

    const trashIcon = (
      <TouchableOpacity 
        style={ buttonStyle }
        onPress={ this.removeFromFaves(item.key) }
      >
        <FAIcon name="close" color="white" size={15}
          style={{ paddingTop: 0 }}
        />
      </TouchableOpacity>
    );

    return (
      <View
        style={styles.emoteContainer}
        key={item.key}
      >
        <View style={styles.emoteBackground}>
          { trashIcon }
          <Text style={styling.item_text}>{item.text}</Text>
        </View>
      </View>
    )
  }

  render() {
    return (
      
        <View style={{flex: 1, paddingHorizontal: 0}}>
          {/* <View style={{ 
            width: "100%", backgroundColor: "white", justifyContent: "center", alignItems: "flex-end",
            paddingHorizontal: 30
          }}>
            <TouchableWithoutFeedback onPress={this.toggleModal}>
              <Text style={{ color:"#facbc8", fontSize: 18, paddingVertical: 10 }}>Edit</Text>
            </TouchableWithoutFeedback>
          </View> */}
          {/* <Button color="#facbc8" title="Show modal" onPress={this.toggleModal} /> */}
          <Modal isVisible={this.state.isModalVisible}>
            <View style={{flex: 1}}>
              <Text>Hello!</Text>
              <Button title="Done" onPress={this.handleEditButtonPress} />
            </View>
          </Modal>
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} 
            scrollEnabled={this.state.scrollEnabled}
          >
            <View style={styles.main}>
              <DraggableGrid
                numColumns={2}
                renderItem={this.renderItem}
                itemHeight={60}
                data={this.state.orderedFaves}
                onDragStart={() => {
                  this.setState({ scrollEnabled: false })
        
                }}
                onDragRelease={(orderedFaves) => {
                  console.log(orderedFaves);
                  this.saveFavesOrder(orderedFaves);
                  this.setState({orderedFaves, scrollEnabled: true});// need reset the props data sort after drag release
                }}
              />
            </View>
          </ScrollView>
        </View>
      
    );
  }
}


export default connect(mSTP, mDTP)(FavesListDraggable); 