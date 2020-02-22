import React from "react";
import { ScrollView, Text, View, Clipboard, TouchableOpacity } from 'react-native';
import { EMOTES, styles } from "./util/MoodUtil";

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

  handleTouch(str) {
    return () => {
      Clipboard.setString(str);
      this.setState({justTouched: str});
      setTimeout(() => {
        this.setState({justTouched: ""})
      }, 800)
    }
  }

  render() {
    if (!this.state.emotes) return null;

    const emotes = this.state.emotes.map((str, i) => (
      <TouchableOpacity key={i} style={styles.emoteBackground} onPress={this.handleTouch(str)}>
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