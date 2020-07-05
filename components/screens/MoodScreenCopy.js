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
  Button,
  FlatList, SafeAreaView
} from 'react-native';

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

  handleEditButtonPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
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
            <FAIcon name="heart-o" color="#ffd4cf" size={29}
              style={{ marginRight: 14 }}
            />
            <OcticonsIcon name="plus" color="#ffd4cf" size={14}
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
              { color: "#ffd4cf", fontSize: 15, marginRight: 14, fontWeight: "600" }
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

  // renderOption = (item) => {
  //   return (
  //     <TouchableOpacity
  //       key={item.id}
  //       style={styles.item}
  //       // onLongPress={event => this.handleLongPress(item, event)}
  //     >
  //       {/* <View style={{ width: "100%", height: "100%", zIndex: 10 }}> */}
  //       <Text style={{ color: "gray" }}>{item.title}</Text>
  //       {/* </View> */}
  //     </TouchableOpacity>
  //   )
  // }

  renderItem = (str, i) => {
    // let listData =  [{
    //   id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    //   title: 'Add to Favorites',
    // },
    // {
    //   id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    //   title: 'Share',
    // },
    // ];

    // let flatlist = (
    //   <SafeAreaView>
    //     <FlatList 
    //       style={{ position: "absolute", top: 0, zIndex: 10}}
    //       data={listData}
    //       renderItem={(item) => this.renderOption(item)}
    //     ></FlatList>
    //   </SafeAreaView>
    // );

    const rightPos = i % 2 === 0 ? 140 : -2;
      const buttonStyle = Object.assign({}, styles.favoriteButton);
      buttonStyle.right = rightPos;
      buttonStyle.top = -5;

      const emoteName = this.state.moodName.toLowerCase() + "-" + i;
      
      const favesIcon = (
        this.state.faves[emoteName] ? (
          // flatlist
        <View style={ { ...buttonStyle, backgroundColor: "transparent", borderColor: "transparent" } }>
        <FAIcon name="heart" color="#ffd4cf" size={20}
          // style={{ paddingTop: 3, position: "absolute" }}
          style={{ paddingTop: 3 }}
        />
        </View>
      ) 
        : (
          <View style={{...buttonStyle, backgroundColor: "transparent", borderColor: "transparent"}}>
            <FAIcon name="heart-o" color="#ffd4cf" size={20}
              style={{ paddingTop: 3  }}
            />
          </View>
        )
      );

      if (this.state.editing) {
        return (
          <TouchableOpacity key={`container-${i}`} style={ styles.emoteContainer } onPress={ this.state.faves[emoteName] ? this.removeFromFaves(emoteName) : this.addToFaves(emoteName, str) }>
            <View style={styles.emoteBackground}>
              { favesIcon }
              <Text key={i} style={styles.emoteText}>
                {str}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }

      return (
        <View key={`container-${i}`} style={ styles.emoteContainer }>
          <TouchableOpacity key={i} 
            onPress={this.handleTouch(str)} onLongPress={this.handleMenuLongPress(str)}
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