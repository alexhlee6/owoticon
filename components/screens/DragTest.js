import { connect } from 'react-redux';
import { getAllFaves, addFave, deleteFave, updateFaveOrder } from '../../redux/actions/fave_actions';

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
  ScrollView, Text, View, Clipboard, TouchableWithoutFeedback, TouchableOpacity, Share, StyleSheet
} from 'react-native';

import { DraggableGrid } from 'react-native-draggable-grid';


const styling = StyleSheet.create({
  button:{
    width:150,
    height:100,
    backgroundColor:'blue',
  },
  item:styles.emoteBackground,
  item_text:styles.emoteText,
});

import styles from '../styles/EmoteListStyles';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import * as Haptics from 'expo-haptics';

class DragTestScreen extends React.Component {
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
      orderedFaves
    }
    this.renderEditButton();
    this.handleTouch = this.handleTouch.bind(this);
  }

  componentDidMount() {
    //this.props.getAllFaves()
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
      // .then(() => this.setState({ faves: this.props.faves, favesPos: this.props.favesPos }));
  }

  handleEditButtonPress = () => {
    if (this.state.editing) {
      this.setState({ editing: false });
      this.renderEditButton();
    } else {
      this.setState({ editing: true });
      this.renderEditButton();
    }
  }

  renderEditButton = () => {
    this.props.navigation.setOptions({
      title: "Drag Test",
      headerRight: () => {
        return !this.state.editing ? (
          <TouchableOpacity
            style={{ position: "relative" }}
            onPress={this.handleEditButtonPress}
          >
            <FAIcon name="heart-o" color="#fcddd9" size={29}
              style={{ marginRight: 14 }}
            />
            <OcticonsIcon name="plus" color="#fcddd9" size={14}
              style={{
                marginRight: 14, position: "absolute", zIndex: 5, bottom: 10,
                left: 15
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ position: "relative" }}
            onPress={this.handleEditButtonPress}
          >
            <Text onPress={this.handleEditButtonPress} style = {
              { color: "#fcddd9", fontSize: 15, marginRight: 14, fontWeight: "600" }
            }>DONE</Text>
          </TouchableOpacity>
        )
      }
    });
  }

  handleTouch(str) {
    return () => {
      Haptics.selectionAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Clipboard.setString(str);
      this.setState({justTouched: str});
      setTimeout(() => {
        if (this.state.justTouched === str) {
          this.setState({ justTouched: "" });
        }
      }, 800)
    }
  }

  handleLongPress(str) {
    return async () => {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        this.setState({ justLongPressed: str, menuOpen: true});
        await Share.share({
          message: str
        }, {
          excludedActivityTypes: [
            "com.apple.UIKit.activity.PostToWeibo",
            "com.apple.UIKit.activity.Mail",
            "com.apple.UIKit.activity.Print",
            "com.apple.UIKit.activity.AssignToContact",
            "com.apple.UIKit.activity.SaveToCameraRoll",
            "com.apple.UIKit.activity.AddToReadingList",
            "com.apple.UIKit.activity.PostToFlickr",
            "com.apple.UIKit.activity.PostToVimeo",
            "com.apple.UIKit.activity.PostToTencentWeibo",
            "com.apple.UIKit.activity.AirDrop",
            "com.apple.UIKit.activity.OpenInIBooks",
            "com.apple.UIKit.activity.MarkupAsPDF",
            "com.apple.reminders.RemindersEditorExtension",
            "com.apple.mobilenotes.SharingExtension",
            "com.apple.mobileslideshow.StreamShareService",
          ]
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  // render() {
  //   const emotesArray = [];
  //   this.state.favesPos.map(key => emotesArray.push(this.state.faves[key]));

  //   const emotes = emotesArray.map((str, i) => {
  //     const rightPos = i % 2 === 0 ? 150 : -10;
  //     const buttonStyle = Object.assign({}, styles.favoriteButton);
  //     buttonStyle.right = rightPos;

  //     const emoteName = this.state.favesPos[i];
      
  //     const favesIcon = (
  //       this.state.faves[emoteName] ? (
  //         <TouchableOpacity 
  //           style={ buttonStyle }
  //           onPress={ this.removeFromFaves(emoteName) }
  //         >
  //           <FAIcon name="heart" color="#fcddd9" size={18}
  //             style={{ paddingTop: 3 }}
  //           />
  //         </TouchableOpacity>
  //       ) : (
  //           <TouchableOpacity 
  //             style={buttonStyle}
  //             onPress={this.addToFaves(emoteName, str)}
  //           >
  //             <FAIcon name="heart-o" color="#fcddd9" size={18}
  //               style={{ paddingTop: 3 }}
  //             />
  //           </TouchableOpacity>
  //       )
  //     );

  //     return (
  //       <View key={`container-${i}`} style={ styles.emoteContainer }>
  //         <TouchableOpacity key={i} 
  //           onPress={this.handleTouch(str)} onLongPress={this.handleLongPress(str)}
  //         >
  //           <View style={styles.emoteBackground}>
  //           { this.state.justTouched === str ? <Text style={styles.copiedText}>Copied!</Text> : null }
  //           { this.state.editing && favesIcon }
  //           <Text key={i} style={styles.emoteText}>
  //             {str}
  //           </Text>
  //           </View>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   });

  //   return (
  //     <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
  //       <View style={styles.main}>
  //         { emotes }
  //       </View>
  //     </ScrollView>
  //   )
  // }
  // renderItem = ({ item, index, drag, isActive }) => {
  //   return (
  //     <TouchableOpacity
  //       style={{
  //         height: 100,
  //         width: "50%",
  //         backgroundColor: isActive ? "blue" : item.backgroundColor,
  //         alignItems: "center",
  //         justifyContent: "center"
  //       }}
  //       onLongPress={drag}
  //     >
  //       <Text
  //         style={{
  //           fontWeight: "bold",
  //           color: "white",
  //           fontSize: 32
  //         }}
  //       >
  //         {item.label}
  //       </Text>
  //     </TouchableOpacity>
  //   );
  // };
  renderItem = (item) => {
    return (
      <View
        style={styling.item}
        key={item.key}
      >
        <Text style={styling.item_text}>{item.text}</Text>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.main}>
        <DraggableGrid
          numColumns={2}
          renderItem={this.renderItem}
          itemHeight={60}
          data={this.state.orderedFaves}
          onDragRelease={(orderedFaves) => {
            console.log(orderedFaves);
            this.saveFavesOrder(orderedFaves);
            this.setState({orderedFaves});// need reset the props data sort after drag release
          }}
        />
      </View>
    );
  }
}


export default connect(mSTP, mDTP)(DragTestScreen); 