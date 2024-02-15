import React, { Component } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import firebase from '../Database/firebaseDB'
import { Card, Title, Paragraph } from 'react-native-paper';

export default class ReadAuth extends Component {
    constructor() {
        super();
        this.subjCollection = firebase.firestore().collection("message");
        this.state = {
            subject_list: [],
        };
    }
    getCollection = (querySnapshot) => {
        const all_data = [];
        querySnapshot.forEach((res) => {
            const { student_id, text, id } = res.data();
            all_data.push({ student_id: student_id, text: text, id: id });
        });
        this.setState({ subject_list: all_data, });

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
            < ScrollView style={styles.container} >
                {this.state.subject_list.map((item, i) => (
                    <Card key={i} style={{
                        borderRadius: 15,
                        elevation: 15,
                        padding: 10,
                        width: "90%",
                        alignSelf: 'center',
                        marginTop: "8%",
                        marginBottom: "5%",
                    }}>
                        <Card.Content>
                            <Title>รหัสนักศึกษา : {item.student_id}</Title>
                        </Card.Content>
                        <Card.Content style={{
                            backgroundColor: "pink", padding: 20, borderRadius: 15,
                        }}>
                            <Paragraph>{item.text}</Paragraph>
                            <Paragraph>เวลา : {item.id}</Paragraph>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFDA79",
    },
});