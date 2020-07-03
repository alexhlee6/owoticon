import { connect } from 'react-redux';
import { getAllFaves, addFave, deleteFave } from '../../redux/actions/fave_actions';

const mSTP = (state, ownProps) => {
  return {
    faves: state.faves.faves,
    
  }
}
const mDTP = (dispatch) => {
  return {
    getAllFaves: () => dispatch(getAllFaves()),
    addFave: (key, val) => dispatch(addFave(key, val)),
    deleteFave: (faveKey) => dispatch(deleteFave(faveKey))
  }
}

import React from "react";
import { 
  ScrollView, Text, View, Clipboard, TouchableWithoutFeedback, TouchableOpacity, Share,
  Button
} from 'react-native';
import Modal from 'react-native-modal';

import { EMOTES } from "./util/MoodUtil";
import styles from '../styles/EmoteListStyles';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import * as Haptics from 'expo-haptics';




class MoodScreen extends React.Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    let moodName = props.route.params.name;
    this.state = {
      moodName,
      filePath: `./util/emotes/${moodName}.txt`,
      justTouched: "",
      justLongPressed: "",
      menuOpen: false,
      editing: false,
      emotes: EMOTES[moodName],
      faves: this.props.faves,
      orderedFaves: this.props.orderedFaves,
      isModalVisible: false,
      modalData: {
        key: "",
        str: ""
      }
    }
    this.renderEditButton();
    this.handleTouch = this.handleTouch.bind(this);
  }

  componentDidMount() {
    
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        faves: this.props.faves,
        orderedFaves: this.props.orderedFaves
      });
    }
  }

  addToFaves = (key, str) => {
    return () => {
      this.props.addFave(key, str)
        .then(() => this.setState({ faves: this.props.faves, orderedFaves: this.props.orderedFaves }));
    }
  }

  removeFromFaves = (key) => {
    return () => {
      this.props.deleteFave(key)
        .then(() => this.setState({ faves: this.props.faves, orderedFaves: this.props.orderedFaves }));
    }
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
      title: this.state.moodName,
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

  // DEVELOPMENT CHECK FOR DUPLICATES:
  // componentDidUpdate() {
  //   if (this.state.emotes) {
  //     let has = [];
  //     let set = new Set();
  //     this.state.emotes.forEach(str => {
  //       if (set.has(str)) {
  //         has.push(str);
  //       } else {
  //         set.add(str);
  //       }
  //     });
  //     if (has.length > 0) alert(has.join(","));
  //   }
  // }

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



  // handleLongPress(emoteKey, emoteStr) {
  //   return () => {
  //     this.openModal(emoteKey, emoteStr);
  //     // try {
  //     //   Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  //     //   this.setState({ justLongPressed: str, menuOpen: true});
  //     //   await Share.share({
  //     //     message: str
  //     //   }, {
  //     //     excludedActivityTypes: [
  //     //       "com.apple.UIKit.activity.PostToWeibo",
  //     //       "com.apple.UIKit.activity.Mail",
  //     //       "com.apple.UIKit.activity.Print",
  //     //       "com.apple.UIKit.activity.AssignToContact",
  //     //       "com.apple.UIKit.activity.SaveToCameraRoll",
  //     //       "com.apple.UIKit.activity.AddToReadingList",
  //     //       "com.apple.UIKit.activity.PostToFlickr",
  //     //       "com.apple.UIKit.activity.PostToVimeo",
  //     //       "com.apple.UIKit.activity.PostToTencentWeibo",
  //     //       "com.apple.UIKit.activity.AirDrop",
  //     //       "com.apple.UIKit.activity.OpenInIBooks",
  //     //       "com.apple.UIKit.activity.MarkupAsPDF",
  //     //       "com.apple.reminders.RemindersEditorExtension",
  //     //       "com.apple.mobilenotes.SharingExtension",
  //     //       "com.apple.mobileslideshow.StreamShareService",
  //     //     ]
  //     //   });
  //     // } catch (error) {
  //     //   console.log(error.message);
  //     // }
  //   }
  // }

  openModal = (emoteKey, emoteStr) => {
    return () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      this.setState({ isModalVisible: true, modalData: { key: emoteKey, str: emoteStr }});
    }
  }

  closeModal = () => {
    this.setState({ isModalVisible: false, modalData: { key: "", str: "" } });
  }

  toggleModal = () => {
    this.setState({isModalVisible: !this.state.isModalVisible});
  };

  openShareMenu = async (str) => {
    
    try {
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      this.setState({ justLongPressed: str, menuOpen: true });
      
      // let closeModal = this.closeModal;

      const result = await Share.share({
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
      console.log(result);
      if (result.action === Share.sharedAction) {
        if (result) {
          this.closeModal();
          // shared with activity type of result.activityType
        } else {
          this.closeModal();
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
      //   .then((res) => {
      //     console.log(res);
      //     closeModal();
          // if(action === Share.dismissedAction) {
          //   this.setState({ justLongPressed: "", menuOpen: false, isModalVisible: false })
          // } else {
          //   this.setState({ justLongPressed: "", menuOpen: false, isModalVisible: false })
          // }
        // });
        // this.closeModal();
      // .then(() => this.setState({ justLongPressed: "", menuOpen: false, isModalVisible: false }));
      // this.setState({ justLongPressed: "", menuOpen: false, isModalVisible: false });
    } catch (error) {
      console.log(error.message);
    }
  }

  render() {
    if (!this.state.emotes) return null;

    const emotes = this.state.emotes.map((str, i) => {
      const rightPos = i % 2 === 0 ? 150 : -10;
      const buttonStyle = Object.assign({}, styles.favoriteButton);
      buttonStyle.right = rightPos;

      const emoteName = this.state.moodName.toLowerCase() + "-" + i;
      
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
      ) 
        : (
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
            onPress={this.handleTouch(str)} onLongPress={this.openModal(emoteName, str)}
          >
            <View style={styles.emoteBackground}>
            { (this.state.justTouched === str && !this.state.isModalVisible) ? <Text style={styles.copiedText}>Copied!</Text> : null }
            { this.state.editing && favesIcon }
            <Text key={i} style={styles.emoteText}>
              {str}
            </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    });

    return (
      <View style={{ flex: 1, paddingHorizontal: 0 }}>
        {/* <View style={{ 
          width: "100%", backgroundColor: "white", justifyContent: "center", alignItems: "flex-end",
          paddingHorizontal: 30
        }}>
          <TouchableWithoutFeedback onPress={this.toggleModal}>
            <Text style={{ color:"#facbc8", fontSize: 18, paddingVertical: 10 }}>Edit</Text>
          </TouchableWithoutFeedback>
        </View> */}

        {/* MODAL CONTENT */}
        <Modal 
          isVisible={this.state.isModalVisible}
          backdropColor="black"
          // coverScreen={false}
          backdropOpacity={0.3}
          onBackdropPress={this.closeModal}
          style={{flex: 1, alignItems: "center", justifyContent: "center"}}
        >
          {/* <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}> */}
            <View style={{ 
              backgroundColor: "white", width: "80%", height: 220, borderRadius: 10,
              padding: 20, alignItems: "center", justifyContent: "space-between"
            }}>
              <View style={{
                height: "40%", justifyContent: "center"
              }}>
                <TouchableOpacity 
                  onPress={this.handleTouch(this.state.modalData.str)}
                  style={Object.assign({},styles.emoteBackground, {borderColor: "transparent"})}
                  // style={
                  //   Object.assign({}, styles.emoteBackground, {
                  //     borderColor: "#ffd9d4",
                  //     backgroundColor: "#fcfcfc"
                  //   })
                  // }
                >
                  { this.state.justTouched === this.state.modalData.str && this.state.isModalVisible ? (
                    <Text style={styles.copiedText}>Copied!</Text> 
                  ) : null }
                  <Text 
                    style={{ 
                      fontSize: 20, 
                      width: "100%", 
                      textAlign: "center", 
                      color: "gray"
                      // paddingVertical: 10,
                    }}
                  >
                    { this.state.modalData.str }
                  </Text>
                </TouchableOpacity>
              </View>
              <View>

                { this.state.faves[this.state.modalData.key] ? (
                  <Button 
                    title="Remove from Favorites" 
                    onPress={this.removeFromFaves(this.state.modalData.key)} 
                    color="#ffc2ba"
                  />
                ) : (
                  <Button 
                    title="Add to Favorites" 
                    onPress={
                      this.addToFaves(this.state.modalData.key, this.state.modalData.str)
                    } 
                    color="#ffc2ba"
                  />
                ) }
                <Button title="Share this Owoticon" onPress={() => this.openShareMenu(this.state.modalData.str)} color="#ffc2ba" />
                <Button title="Close" onPress={this.closeModal} color="#ffc2ba" />
              </View>
              
            </View>
          {/* </View> */}
        </Modal>
      
        {/* EMOTE LIST */}
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <View style={styles.main}>
            { emotes }
          </View>
        </ScrollView>
      </View>
    )
  }
}


export default connect(mSTP, mDTP)(MoodScreen);