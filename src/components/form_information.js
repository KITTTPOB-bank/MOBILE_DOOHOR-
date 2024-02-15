import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import firebase from '../Database/firebaseDB'
import { ListItem } from 'react-native-elements'
import { Card, Title, Paragraph } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default class form_information extends Component {
    constructor() {
        super();
        this.uid = firebase.auth().currentUser.uid

        this.subjCollection = firebase.firestore().collection("office_documents");
        this.state = {
            subject_list: [],
            upload: null,
            check: -1
        };
    }
    getCollection = () => {
        const all_data = [];
        firebase.firestore()
            .collection('office_documents')
            .where('uid', '==', this.uid)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((res) => {
                    const { title, desc, dormitory_bill, image_documents, type } = res.data();
                    all_data.push({ title: title, desc: desc, dormitory_bill: dormitory_bill, desc: desc, image_documents: image_documents, id: res.id, type: type });
                });
                this.setState({ subject_list: all_data, });
            });
    };

    componentDidMount() {
        this.unsubscribe =
            this.subjCollection.onSnapshot(this.getCollection);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    async pickImage(i) {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })
        const source = { uri: result.uri };
        this.setState({
            check: i,
            upload: source
        });
    };
    async add(i) {
        console.log(this.state.subject_list[i].id)
        const db = firebase.firestore();
        const response = await fetch(this.state.upload.uri)
        const blob = await response.blob();
        const filename = this.state.upload.uri
        var ref1 = firebase.storage().ref().child(filename).put(blob);
        try {
            await ref1;
        }
        catch (e) {
            console.log(e)
        }

        db.collection("office_documents").doc(this.state.subject_list[i].id).update({
            picture_from_user: filename

        })
        this.setState({
            check: -1,
            upload: null
        });
    }
    back() {
        this.setState({
            check: -1
        });
    };

    render() {
        return (
            <View>
                {this.state.subject_list.map((item, i) => (
                    <ListItem key={i} style={{ display: this.state.subject_list[i].type == "Bill" ? 'flex' : 'none' && this.state.subject_list[i].type == "Petition" ? 'flex' : 'none' }}>
                        <Card style={{
                            borderRadius: 15,
                            elevation: 15,
                            padding: 10,
                            width: "90%",
                            alignSelf: 'center',
                            marginTop: "8%",
                            marginLeft: "5%"
                        }}>
                            <Card.Content>
                                <Title>{item.title}</Title>
                                <Paragraph>{item.desc}</Paragraph>
                            </Card.Content>
                            <Card.Cover style={{ width: "90%", height: 200, alignSelf: "center", marginTop: '5%', resizeMode: "contain" }} source={{ uri: item.image_documents }} />
                            <Card.Actions>
                                <TouchableOpacity onPress={() => this.pickImage(i)}>
                                    <View style={{ padding: 5, flexDirection: "row" }}>
                                        <Text style={{ fontSize: 15, padding: 5 }}>อัพโหลดรูปภาพ</Text>
                                        <AntDesign name="upload" size={20} color="black" style={{ backgroundColor: "white", padding: 5, borderRadius: 10, marginLeft: 2, overflow: "hidden" }} />
                                    </View>
                                </TouchableOpacity>
                            </Card.Actions>
                            <Card.Actions style={{ display: i == this.state.check ? 'flex' : 'none', }}>
                                <TouchableOpacity onPress={() => this.add(i)} >
                                    <View style={{ backgroundColor: "#77CF32", padding: 5, borderRadius: 10, width: "100%", alignSelf: "center", marginVertical: 10 }}>
                                        <Text style={{ color: "white", alignSelf: "center", fontSize: 16 }}>
                                            ยืนยัน
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.back()}>
                                    <View style={{ backgroundColor: "red", padding: 5, borderRadius: 10, width: "100%", alignSelf: "center", marginVertical: 10 }}>
                                        <Text style={{ color: "white", alignSelf: "center", fontSize: 16 }}>
                                            ยกเลิก
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </Card.Actions>
                        </Card>
                    </ListItem>
                ))
                }
            </View>
        )
    }
}


