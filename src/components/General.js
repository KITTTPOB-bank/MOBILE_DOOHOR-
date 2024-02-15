import React, { Component } from 'react';
import { View } from 'react-native';
import firebase from '../Database/firebaseDB'
import { ListItem } from 'react-native-elements'
import { Card, Title, Paragraph } from 'react-native-paper';

export default class General extends Component {
    constructor() {
        super();
        this.uid = firebase.auth().currentUser.uid
        this.subjCollection = firebase.firestore().collection("office_documents");
        this.state = {
            subject_list: [],
        };
    }

    getCollection = () => {
        const all_data = [];
        firebase.firestore()
            .collection('office_documents')
            .where('uid', '==', this.uid).where("type", "==", "General")
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

    render() {
        return (
            <View>
                {this.state.subject_list.map((item, i) => (
                    <ListItem key={i} >
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
                            <Card.Cover style={{ width: "90%", height: 200, alignSelf: "center", marginTop: '5%', resizeMode: "contain" }}
                                source={{ uri: item.image_documents }} />
                            <Card.Actions>
                            </Card.Actions>
                        </Card>
                    </ListItem>
                ))
                }
            </View>
        )
    }
}


