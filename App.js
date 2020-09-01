import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  PermissionsAndroid
} from 'react-native';
import CallDetectorManager from "react-native-call-detection";

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      featureOn: false,
      incoming: false,
      number: null
    };
  }

  askPermission = async () => {
    try {
      const permissions = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE
        ]);
      console.log('Permissions are: ', permissions);
    } catch (err) {
      console.warn(err);
    }
  }

  componentDidMount() {
    this.askPermission();
  }

  startListenerTapped = () => {
    this.setState({ featureOn: true });
    this.callDetector = new CallDetectorManager(
      (event, number) => {
        if (event === "Disconnected") {
          this.setState({ incoming: false, number: null });
          console.log(number, "Disconnected")
        } else if (event === "Incoming") {
          console.log(number, "Incoming")
          this.setState({ incoming: true, number });
        } else if (event === "Offhook") {
          console.log(number, "Offhook")
          this.setState({ incoming: true, number });
        } else if (event === "Missed") {
          this.setState({ incoming: false, number: null });
          console.log(number, "Missed")
        }
      },
      true,
      () => { },
      {
        title: "Phone State Permission",
        message:
          "This app needs access to your phone state in order to react and/or to adapt to incoming calls."
      }
    );
  }

  stopListenerTapped = () => {
    this.setState({ featureOn: false });
    this.callDetector && this.callDetector.dispose();
  }

  render() {
    return (
      <View style={styles.body}>
        <Text style={styles.text}>Should the detection be on?</Text>
        <TouchableHighlight
          onPress={
            this.state.featureOn
              ? this.stopListenerTapped
              : this.startListenerTapped
          }
        >
          <View
            style={{
              width: 200,
              height: 200,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: this.state.featureOn ? "greenyellow" : "red"
            }}>
            <Text style={styles.text}>
              {this.state.featureOn ? `ON` : `OFF`}{" "}
            </Text>
          </View>
        </TouchableHighlight>
        {this.state.incoming && (
          <Text style={{ fontSize: 50 }}>Incoming {this.state.number}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "honeydew",
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  text: {
    padding: 20,
    fontSize: 20
  }
});