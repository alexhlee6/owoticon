import { connect } from 'react-redux';
import { getAllFaves, addFave, deleteFave, updateFaveOrder } from '../../../redux/actions/fave_actions';

const mSTP = (state, ownProps) => {
  return {
    faves: state.faves.faves,
    favesPos: state.faves.favesPos,
    orderedFaves: state.faves.orderedFaves
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
  ScrollView, Text, View, Clipboard, TouchableWithoutFeedback, TouchableOpacity, Share, StyleSheet, Button, Animated
} from 'react-native';

import { DraggableGrid } from 'react-native-draggable-grid';
import SortableGrid from 'react-native-sortable-grid'

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
    
    // let orderedFaves = [];
    // props.favesPos.forEach(key => {
    //   orderedFaves.push({ key, text: props.faves[key], disabledDrag: false })
    // });

    this.state = {
      justTouched: "",
      justLongPressed: "",
      menuOpen: false,
      editing: false,
      faves: props.faves,
      favesPos: props.favesPos,
      orderedFaves: props.orderedFaves,
      isModalVisible: false,
      // dragStartAnimatedValue: new Animated.Value(1),
      animation: new Animated.Value(0),
    }
  }

  componentDidMount() {
 
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      // let orderedFaves = [];
      // this.props.favesPos.forEach(key => {
      //   orderedFaves.push({ key, text: this.props.faves[key], disabledDrag: false })
      // });
      this.setState({
        faves: this.props.faves,
        favesPos: this.props.favesPos,
        orderedFaves: this.props.orderedFaves
      });
    }
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  addToFaves = (key, str) => {
    return () => {
      this.props.addFave(key, str)
        .then(() => this.setState({ 
          faves: this.props.faves, favesPos: this.props.favesPos, orderedFaves: this.props.orderedFaves 
        }));
    }
  }

  removeFromFaves = (key) => {
    return () => {
      this.props.deleteFave(key)
        .then(() => this.setState({ 
          faves: this.props.faves, favesPos: this.props.favesPos, orderedFaves: this.props.orderedFaves 
        }));
    }
  }

  saveFavesOrder = (newOrderedFaves) => {
    // let newFavesPos = [];
    // newOrderedFaves.forEach(item => {
    //   newFavesPos.push(item.key);
    // });
    newOrderedFaves = newOrderedFaves.map(item => {
      delete item["disabledDrag"];
      return item;
    });
    this.props.updateFaveOrder(newOrderedFaves);
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

  // getDragStartAnimation() {
  //   return {
  //     transform: [
  //       {
  //         scale: this.state.dragStartAnimatedValue,
  //       },
  //     ],
  //     shadowColor: '#000000',
  //     shadowOpacity: 0.2,
  //     shadowRadius: 6,
  //     shadowOffset: {
  //       width: 1,
  //       height: 1,
  //     },
  //   }
  // }

  startCustomAnimation = () => {
    console.log("Custom animation started!")

    Animated.timing(
      this.state.animation,
      { toValue: 100, duration: 500 }
    ).start( () => {

      Animated.timing(
        this.state.animation,
        { toValue: 0, duration: 500 }
      ).start()

    })
  }
  
  getDragStartAnimation = () => {
    return { transform: [
      {
        scaleX: this.state.animation.interpolate({
          inputRange: [0, 100],
          outputRange: [1, -1.5],
        })
      },
      {
        scaleY: this.state.animation.interpolate({
          inputRange: [0, 100],
          outputRange: [1, 1.5],
        })
      },
      { rotate: this.state.animation.interpolate({
        inputRange:  [0, 100],
        outputRange: ['0 deg', '450 deg']})
      }
    ]}
  }

  render() {
    return (
      <View>
        <ScrollView 
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} 
            scrollEnabled={this.state.scrollEnabled}
        >
          <SortableGrid
          blockTransitionDuration={200}
          activeBlockCenteringDuration={200}
          itemWidth={200}
          itemHeight={60}
          dragActivationTreshold={300}
          onDragRelease                = { (itemOrder) => {
            console.log("Drag was released, the blocks are in the following order: ", itemOrder) 
            this.setState({ scrollEnabled: true })
          }}
          onDragStart                  = { () => {
            this.setState({ scrollEnabled: false })
          } } 
          // dragStartAnimation={
          //   this.getDragStartAnimation()
          // }
          >
      
          {
            this.state.favesPos.map( (key, index) =>
      
              <View style={styles.emoteBackground} key={index} onTap={() => console.log("Item number:", index, "was tapped!") }>
                <Text style={styles.emoteText}>{this.state.faves[key]}</Text>
              </View>
      
            )
          }
      
        </SortableGrid>
      </ScrollView>
    </View>
    )
  }
  // render() {
  //   return (
      
  //       <View style={{flex: 1, paddingHorizontal: 0}}>
  //         {/* <View style={{ 
  //           width: "100%", backgroundColor: "white", justifyContent: "center", alignItems: "flex-end",
  //           paddingHorizontal: 30
  //         }}>
  //           <TouchableWithoutFeedback onPress={this.toggleModal}>
  //             <Text style={{ color:"#facbc8", fontSize: 18, paddingVertical: 10 }}>Edit</Text>
  //           </TouchableWithoutFeedback>
  //         </View> */}
  //         {/* <Button color="#facbc8" title="Show modal" onPress={this.toggleModal} /> */}
  //         <Modal isVisible={this.state.isModalVisible}>
  //           <View style={{flex: 1}}>
  //             <Text>Hello!</Text>
  //             <Button title="Done" onPress={this.handleEditButtonPress} />
  //           </View>
  //         </Modal>
  //         <ScrollView 
  //           contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} 
  //           scrollEnabled={this.state.scrollEnabled}
  //         >
  //           <View style={styles.main}>
  //             <DraggableGrid
  //               numColumns={2}
  //               renderItem={this.renderItem}
  //               itemHeight={60}
  //               data={this.state.orderedFaves}
  //               onDragStart={() => {
  //                 this.setState({ scrollEnabled: false })
  //               }}
  //               onDragRelease={(orderedFaves) => {
  //                 console.log(orderedFaves);
  //                 this.saveFavesOrder(orderedFaves);
  //                 this.setState({orderedFaves, scrollEnabled: true});// need reset the props data sort after drag release
  //               }}
  //             />
  //           </View>
  //         </ScrollView>
  //       </View>
      
  //   );
  // }
}


export default connect(mSTP, mDTP)(FavesListDraggable); 