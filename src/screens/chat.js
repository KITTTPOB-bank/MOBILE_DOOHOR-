import React, { Component } from "react";
import { StyleSheet, View, TextInput, TouchableOpacity, Text } from "react-native";
import firebase from "../Database/firebaseDB";
import { Card, Paragraph } from 'react-native-paper';
import { Feather } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView, Image } from "react-native";
import firebase from "../Database/firebaseDB";
import { ListItem } from "react-native-elements";
import { Button, Input } from "react-native-elements";

class Sceeenchat extends Component {
  constructor() {
    super();
    this.messageCollection = firebase.firestore().collection("message");
    this.user = firebase.firestore().collection("Users");
    this.uid = firebase.auth().currentUser.uid
    this.state = {
      message_list: [],
      message: "",
      name: "",
      id: Date().toLocaleString(),
    };
  }

  inputValueUpdate = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  storeSubject() {
    this.messageCollection
      .add({
        id: this.state.id.slice(0, this.state.id.lastIndexOf("+") - 10),
        student_name: this.state.name,
        text: this.state.message,
      })
      .then((res) => {
        this.setState({
          message: "",
        });
        Alert.alert(
          "Adding Alert",
          "New subject was added!! Pls check your DB!!"
        );
      });
  }

  getCollection = (querySnapshot) => {
    let all_get = "";
    firebase.firestore()
      .collection('Users')
      .where('uid', '==', this.uid)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach((res) => {
          let { first_name, last_name } = res.data();
          all_get = first_name + " " + last_name
        });
        this.setState({
          name: all_get,
        });
      });

    const all_data = [];
    querySnapshot.forEach((res) => {

      const { student_name, text, id } = res.data();


      all_data.push({
        student_name,
        text,
        id
      });
    });
    // console.log("all_data : ", all_data);
    this.setState({
      message_list: all_data,
    });
  };

  componentDidMount() {
    this.unsubscribe = this.messageCollection.onSnapshot(this.getCollection);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    return (
      <KeyboardAwareScrollView extraHeight={130} style={styles.container}>
        {this.state.message_list.map((item, i) => (
          <View key={i} style={{ marginBottom: 10 }}>
            <Card style={{
              borderRadius: 10,
              elevation: 10,
              width: "90%",
              alignSelf: 'center',
              marginBottom: 30,
              overflow: "hidden"
            }}>
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 5 }}>{this.state.name}</Text>
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    backgroundColor: "#FFB053",
                    paddingLeft: 10, padding: 5,
                    borderBottomLeftRadius: 10,
                    borderBottomRightRadius: 10,
                    paddingVertical: 5
                  }}>
                  {item.text}
                  <Paragraph> เวลา : {item.id}</Paragraph>
                </Text>

              </View>
            </Card>
          </View>
        ))}
        <View style={{
          flexDirection: 'row',
          width: "90%",
          padding: 8,
          bottom: 0,
          alignSelf: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          backgroundColor: '#fff',
          marginBottom: 40,
        }}>
          <View style={{ flex: 1, }}>
            <TextInput
              style={{
                height: 25,
                flexDirection: 'row',
                paddingLeft: 10
              }}
              placeholder={"ข้อความ"}
              value={this.state.message}
              onChangeText={(val) => this.inputValueUpdate(val, "message")}
            />
          </View>
          <View style={{ alignSelf: "center", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => this.storeSubject()} >
              <Feather name="send" size={24} color="#0d56de" />
            </TouchableOpacity>
          </View>
        </View>

      </KeyboardAwareScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFDA79",
  },
});
