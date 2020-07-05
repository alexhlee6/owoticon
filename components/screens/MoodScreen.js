import { connect } from 'react-redux';
import { getAllFaves, addFave, deleteFave } from '../../redux/actions/fave_actions';

const mSTP = (state, ownProps) => {
  return {
    faves: state.faves.faves,
    orderedFaves: state.faves.orderedFaves
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
  ScrollView, Text, View, Clipboard, TouchableOpacity, Share, Image
} from 'react-native';

import { EMOTES } from "./util/MoodUtil";
import styles from '../styles/EmoteListStyles';
import * as Haptics from 'expo-haptics';
import { HEART_ICON, HEART_O_ICON } from './util/FavesUtil';



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
      emoteNamePrefix: moodName.toLowerCase() + "-"
    }
    this.handleTouch = this.handleTouch.bind(this);
  }

  componentDidMount() {
    this.renderHeaderTitle();
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      this.props.addFave(key, str)
        .then(() => this.setState({ faves: this.props.faves, orderedFaves: this.props.orderedFaves }));
    }
  }

  removeFromFaves = (key) => {
    return () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      this.props.deleteFave(key)
        .then(() => this.setState({ faves: this.props.faves, orderedFaves: this.props.orderedFaves }));
    }
  }

  renderHeaderTitle = () => {
    this.props.navigation.setOptions({
      title: this.state.moodName,
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
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      Clipboard.setString(str);
      this.setState({justTouched: str});
      setTimeout(() => {
        if (this.state.justTouched === str) {
          this.setState({ justTouched: "" });
        }
      }, 800)
    }
  }

  handleMenuLongPress = (str) => {
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

  renderItem = (str, i) => {
    const buttonStyle = i % 2 === 0 ? styles.buttonStyleLeft : styles.buttonStyleRight;
    const emoteName = this.state.emoteNamePrefix + i;
    const onPress = this.state.faves[emoteName] ? this.removeFromFaves(emoteName) : this.addToFaves(emoteName, str);

    const favesIcon = (
      this.state.faves[emoteName] ? (
        <TouchableOpacity 
          onPress={onPress} 
          style={ buttonStyle }
        >
          <Image source={ HEART_ICON } style={styles.iconStyle} />
        </TouchableOpacity>
    ) 
      : (
        <TouchableOpacity 
          onPress={onPress} 
          style={ buttonStyle }
        >
          <Image source={ HEART_O_ICON } style={styles.iconStyle} />
        </TouchableOpacity>
      )
    );

    return (
      <View key={`container-${i}`} style={ styles.emoteContainer }>
        <TouchableOpacity 
          key={`touchable-${i}`} 
          onPress={this.handleTouch(str)} onLongPress={this.handleMenuLongPress(str)}
        >
          <View style={styles.emoteBackground}>
            { favesIcon }
            { this.state.justTouched === str ? <Text style={styles.copiedText}>Copied!</Text> : null }
            <Text key={i} style={styles.emoteText}>
              {str}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    if (!this.state.emotes) return null;

    const emotes = this.state.emotes.map((str, i) => this.renderItem(str, i));

    return (
      <View style={{ flex: 1, paddingHorizontal: 0 }}>
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