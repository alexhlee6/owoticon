import React from "react";
import { ScrollView, Text, View, Clipboard, TouchableOpacity, Share, Vibration } from 'react-native';
import { EMOTES, styles } from "./util/MoodUtil";
import * as Haptics from 'expo-haptics';

class MoodScreen extends React.Component {
  constructor(props) {
    super(props);
    this.navigation = props.navigation;
    let moodName = props.route.params.name;
    this.state = {
      moodName,
      filePath: `./util/emotes/${moodName}.txt`,
      justTouched: ""
    }
    props.navigation.setOptions({title: moodName});
    this.handleTouch = this.handleTouch.bind(this);
  }

  componentDidMount() {
    this.setState({emotes: EMOTES[this.state.moodName]});
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
      Haptics.selectionAsync(Haptics.ImpactFeedbackStyle.Medium);
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

    const emotes = this.state.emotes.map((str, i) => (
      <TouchableOpacity key={i} style={styles.emoteBackground} onPress={this.handleTouch(str)} onLongPress={this.handleLongPress(str)}>
        {this.state.justTouched === str ? <Text style={styles.copiedText}>Copied!</Text> : null }
        <Text key={i} style={styles.emoteText}>
          {str}
        </Text>
      </TouchableOpacity>
    ));

    return (
      <ScrollView>
        <View style={styles.main}>
          { emotes }
        </View>
      </ScrollView>
    )
  }
}


export default MoodScreen;