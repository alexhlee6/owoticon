import React from "react";
import { ScrollView, Text, View, Clipboard, TouchableWithoutFeedback, TouchableOpacity, AsyncStorage } from 'react-native';
import { EMOTES, styles } from "./util/MoodUtil";
import FAIcon from 'react-native-vector-icons/FontAwesome';
import OcticonsIcon from 'react-native-vector-icons/Octicons';
import * as Haptics from 'expo-haptics';
import MyStorage from "./util/storageUtil";

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
      faves: {},
      favesPos: []
    }
    this.renderEditButton();
    this.handleTouch = this.handleTouch.bind(this);
  }

  componentDidMount() {
    // MyStorage.deleteAllData();
    MyStorage.retrieveAllData().then(data => {
      if (data) {
        this.setState({faves: data.faves, favesPos: data.favesPos});
      } 
    }).catch(err => console.log(err));
  }

  componentDidUpdate() {
    let newState = { faves: this.state.faves, favesPos: this.state.favesPos };
    console.log(newState);
  }

  addToFaves = (key, str) => {
    return () => {
      MyStorage.storeOne(key, str).then(data => {
        this.setState({ faves: data.faves, favesPos: data.favesPos });
      });
    }
  }

  removeFromFaves = (key) => {
    return () => {
      MyStorage.deleteOne(key).then(data => {
        this.setState({ faves: data.faves, favesPos: data.favesPos });
      });
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
    if (!this.state.emotes) return null;

    const emotes = this.state.emotes.map((str, i) => {
      const rightPos = i % 2 === 0 ? 150 : -10;
      const buttonStyle = Object.assign({}, styles.favoriteButton);
      buttonStyle.right = rightPos;

      const emoteName = this.state.moodName.toLowerCase() + "-" + i;
      // console.log(emoteName);
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
      );
    });

    return (
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
        <View style={styles.main}>
          { emotes }
        </View>
      </ScrollView>
    )
  }
}


export default MoodScreen;