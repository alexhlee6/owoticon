import { connect } from 'react-redux';
import { getAllFaves, addFave, deleteFave, updateFaveOrder } from '../../redux/actions/fave_actions';

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
  ScrollView, Text, View, Clipboard, TouchableWithoutFeedback, TouchableOpacity, Share
} from 'react-native';
import FavesListDraggable from './util/FavesListDraggable';
import FavesListSortable from './util/FavesListSortable';
import { DraggableGrid } from 'react-native-draggable-grid';

import styles from '../styles/EmoteListStyles';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import * as Haptics from 'expo-haptics';


class FavesScreen extends React.Component {
  constructor(props) {
    super(props);

    // let orderedFaves = [];
    // props.favesPos.forEach(key => {
    //   orderedFaves.push({ key, text: props.faves[key], disabledDrag: true })
    // });

    
    this.state = {
      justTouched: "",
      justLongPressed: "",
      menuOpen: false,
      editing: false,
      faves: props.faves,
      favesPos: props.favesPos,
      orderedFaves: props.orderedFaves || [],
      scrollEnabled: true
    }
    this.renderEditButton();
    this.handleTouch = this.handleTouch.bind(this);
  }

  componentDidMount() {
    //this.props.getAllFaves()
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      // let orderedFaves = [];
      // this.props.favesPos.forEach(key => {
      //   orderedFaves.push({ key, text: this.props.faves[key], disabledDrag: !this.state.editing })
      // });
      this.setState({
        faves: this.props.faves,
        favesPos: this.props.favesPos,
        orderedFaves: this.props.orderedFaves
        // orderedFaves
      });
    }
  }

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
    newOrderedFaves = newOrderedFaves.map(item => {
      // newFavesPos.push(item.key);
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
      <TouchableOpacity style={ buttonStyle } onPress={ this.removeFromFaves(item.key) }>
        <FAIcon name="close" color="white" size={15} style={{ paddingTop: 0 }} />
      </TouchableOpacity>
    );

    return (
      <View style={styles.emoteContainer} key={item.key}>
        <View style={styles.emoteBackground}>
          { this.state.editing ? trashIcon : null }
          <Text style={styles.emoteText}>{item.text}</Text>
        </View>
      </View>
    );
  }

  handleEditButtonPress = () => {
    let orderedFaves = this.state.orderedFaves.slice();
    orderedFaves = orderedFaves.map(item => {
      item.disabledDrag = this.state.editing ? true : false;
      return item;
    });

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
      title: "Favorites",
      headerRight: () => {
        return !this.state.editing ? (
          <TouchableOpacity
            style={{ position: "relative" }}
            onPress={this.handleEditButtonPress}
          >
            <Text onPress={this.handleEditButtonPress} style = {
              { color: "#fcddd9", fontSize: 15, marginRight: 14, fontWeight: "600" }
            }>EDIT</Text>
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

  render() {
    if(this.state.editing) {
      return <FavesListDraggable navigation={this.props.navigation} />
    }

    const emotesArray = [];
    this.state.favesPos.map(key => emotesArray.push(this.state.faves[key]));

    const emotes = emotesArray.map((str, i) => {
      const rightPos = i % 2 === 0 ? 150 : -10;
      const buttonStyle = Object.assign({}, styles.favoriteButton);
      buttonStyle.right = rightPos;

      const emoteName = this.state.favesPos[i];
      
      const favesIcon = (
        this.state.faves[emoteName] ? (
          <TouchableOpacity 
            style={ buttonStyle }
            onPress={ this.removeFromFaves(emoteName) }
          >
            <FAIcon name="heart" color="#fcddd9" size={18}
              style={{ paddingTop: 3 }}
            />
          </TouchableOpacity>
        ) : (
            <TouchableOpacity 
              style={buttonStyle}
              onPress={this.addToFaves(emoteName, str)}
            >
              <FAIcon name="heart-o" color="#fcddd9" size={18}
                style={{ paddingTop: 3 }}
              />
            </TouchableOpacity>
        )
      );

      return (
        <View key={`container-${i}`} style={ styles.emoteContainer }>
          <TouchableOpacity key={i} 
            onPress={this.handleTouch(str)} onLongPress={this.handleLongPress(str)}
          >
            <View style={styles.emoteBackground}>
              { this.state.justTouched === str ? <Text style={styles.copiedText}>Copied!</Text> : null }
              { this.state.editing && favesIcon }
              <Text key={i} style={styles.emoteText}>
                {str}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    });

    const emoteData = this.state.orderedFaves.map(item => {
      item.dragEnabled = this.state.editing;
      return item
    });

    return (
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} 
        scrollEnabled={this.state.scrollEnabled}
      >
        <View style={styles.main}>
       
          <DraggableGrid
            numColumns={2}
            renderItem={this.renderItem}
            itemHeight={60}
            data={emoteData}
            onDragStart={() => {
              console.log("DRAG START");
              this.setState({ scrollEnabled: false })
            }}
            onDragRelease={(orderedFaves) => {
              //console.log(orderedFaves);
              this.saveFavesOrder(orderedFaves);
              this.setState({ scrollEnabled: true, orderedFaves: orderedFaves.slice() });// need reset the props data sort after drag release
            }}
            // onResetSort={(data) => {
            //   console.log("RESET SORT", data)
            // }}
          />
        
          {/* { emotes } */}
        </View>
      </ScrollView>
    )
  }
}


export default connect(mSTP, mDTP)(FavesScreen);