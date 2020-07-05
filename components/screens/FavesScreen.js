import { connect } from 'react-redux';
import { getAllFaves, addFave, deleteFave, updateFaveOrder } from '../../redux/actions/fave_actions';

const mSTP = (state) => {
  return {
    faves: state.faves.faves,
    orderedFaves: state.faves.orderedFaves
  }
}
const mDTP = (dispatch) => {
  return {
    getAllFaves: () => dispatch(getAllFaves()),
    addFave: (key, val) => dispatch(addFave(key, val)),
    deleteFave: (faveKey) => dispatch(deleteFave(faveKey)),
    updateFaveOrder: (orderedFaves) => dispatch(updateFaveOrder(orderedFaves))
  }
}

import React from "react";
import { 
  ScrollView, Text, View, Clipboard, TouchableWithoutFeedback, TouchableOpacity, Share, Animated, Easing
} from 'react-native';

import { DraggableGrid } from '../elements/draggable_grid';
import styles from '../styles/EmoteListStyles';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import * as Haptics from 'expo-haptics';


class FavesScreen extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      justTouched: "",
      justLongPressed: "",
      menuOpen: false,
      editing: false,
      faves: props.faves,
      orderedFaves: props.orderedFaves || [],
      scrollEnabled: true,
      noFavesYet: false
    }
    this.renderEditButton();
    this.animatedValue = new Animated.Value(0);
  }

  handleAnimation = () => {
    Animated.loop(
      // Animation consists of a sequence of steps
      Animated.sequence([
        // start rotation in one direction (only half the time is needed)
        Animated.timing(this.animatedValue, {toValue: 1.0, duration: 50, easing: Easing.linear, useNativeDriver: true}),
        // rotate in other direction, to minimum value (= twice the duration of above)
        Animated.timing(this.animatedValue, {toValue: -1.0, duration: 100, easing: Easing.linear, useNativeDriver: true}),
        // return to begin position
        Animated.timing(this.animatedValue, {toValue: 0.0, duration: 50, easing: Easing.linear, useNativeDriver: true})
      ])
    ).start(); 
  }
  componentDidMount() {
    if (this.state.orderedFaves.length === 0) {
      this.setState({noFavesYet: true});
    }
    this.props.navigation.addListener('blur', () => {
      if (this.state.editing) {
        this.setState({ editing: false });
        this.renderEditButton();
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {console.log("STATE:", this.state);
      if (this.props.orderedFaves.length === 0) {
        this.setState({noFavesYet: true, faves: this.props.faves,
          orderedFaves: this.props.orderedFaves
        });
      } else {
        this.setState({
          faves: this.props.faves,
          orderedFaves: this.props.orderedFaves,
          noFavesYet: false
        });
      }
    }
  }

  addToFaves = (key, str) => {
    return () => {
      this.props.addFave(key, str)
        .then(() => this.setState({ 
          faves: this.props.faves, orderedFaves: this.props.orderedFaves
        }));
    }
  }

  removeFromFaves = (key) => {
    return () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      this.props.deleteFave(key)
        .then(() => this.setState({ 
          faves: this.props.faves, orderedFaves: this.props.orderedFaves
        }));
    }
  }

  saveFavesOrder = (newOrderedFaves) => {
    this.props.updateFaveOrder(newOrderedFaves);
  }

  renderItem = (item) => {
    if (this.state.editing) {
      const buttonStyle = {
        width: 26, 
        height: 26,
        borderRadius: 50, 
        zIndex: 5,
        // backgroundColor: "#ffd4cf",
        // backgroundColor: "#ffdbd9",
        backgroundColor: "#ffd7d4",
        justifyContent: "center", 
        alignItems: "center",
        position: "absolute", 
        bottom: 32,
        right: -6
      }

      const trashIcon = (
        <TouchableOpacity style={ buttonStyle } onPress={ this.removeFromFaves(item.key) }>
          <FAIcon name="close" color="white" size={16} style={{ paddingTop: 0 }} />
        </TouchableOpacity>
      );
      return (

        <View 
          style={styles.emoteContainer} 
          key={item.key}
        >
          <Animated.View 
            style={{
              ...styles.emoteBackground,
              transform: [{
                rotate: this.animatedValue.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-0.006rad', '0.006rad']
                }),
              }]
            }}
          >
          { trashIcon }
          <Text style={styles.emoteText}>{item.text}</Text>
          </Animated.View>
        </View>
      );
    } else {
      return (
        <View style={styles.emoteContainer} key={item.key}>
          <TouchableOpacity 
            style={styles.emoteBackground} 
            onPress={this.handleCopy(item.text)} 
            onLongPress={this.handleMenuLongPress(item.text)}
          >
            { this.state.justTouched === item.text ? (
              <Text style={styles.copiedText}>Copied!</Text> 
            ) : null }
            <Text style={styles.emoteText}>{item.text}</Text>
          </TouchableOpacity>
        </View>
      )
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
      title: "My Favorites",
      headerRight: () => {
        return !this.state.editing ? (
          <TouchableOpacity
            style={{ position: "relative" }}
            onPress={this.handleEditButtonPress}
          >
            {/* <FAIcon name="cog" color="#fcddd9" size={27} */}
            <FAIcon name="cog" color="#ffcbc7" size={27}
              style={{ marginRight: 16 }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{ position: "relative" }}
            onPress={this.handleEditButtonPress}
          >
            <Text onPress={this.handleEditButtonPress} style = {
              // { color: "#ffd6d1", fontSize: 15, marginRight: 14, fontWeight: "600" }
              { color: "#ffcbc7", fontSize: 15, marginRight: 14, fontWeight: "600" }
            }>DONE</Text>
          </TouchableOpacity>
        )
      }
    });
  }

  handleCopy = (str) => {
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

  handleEditingLongPress = () => {
    this.setState({ scrollEnabled: false });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
  

  render() {
    console.log("STATE:", this.state);
    if (this.state.noFavesYet) {
      return (
        <View style={{ flexGrow: 1, width: "100%", alignItems: "center", justifyContent: "center" }}>
          <Text style={{ opacity: 0.3, fontSize: 18, paddingBottom: 100 }}>No favorites yet</Text>
        </View>
      )
    }

    if (this.state.editing) {
      this.handleAnimation();
    }
    
    return (
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }} 
        scrollEnabled={this.state.scrollEnabled}
      >
        <View style={styles.main}>
       
          <DraggableGrid
            numColumns={2}
            renderItem={this.renderItem}
            itemHeight={65}
            data={this.state.orderedFaves}
            dragEnabled={this.state.editing}
            onLongPress={this.handleEditingLongPress}
            onDragStart={() => {
              this.setState({ scrollEnabled: false })
            }}
            onDragRelease={(orderedFaves) => {
              this.saveFavesOrder(orderedFaves);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              this.setState({orderedFaves, scrollEnabled: true});// need reset the props data sort after drag release
            }}
          />
        </View>
      </ScrollView>
    )
  }
}


export default connect(mSTP, mDTP)(FavesScreen);