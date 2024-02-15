import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Image, SafeAreaView, ScrollView, TextInput } from 'react-native';
import firebase from '../Database/firebaseDB'
import { useRoute } from '@react-navigation/native';
import { Card, Title, Paragraph } from 'react-native-paper';

export default function (props) {
    const route = useRoute();
    return <Detailroom {...props} route={route} />;
    return <Detailroom {...props} navigation={navigation} />;

}
class Detailroom extends Component {
    constructor() {
        super();
        this.uid = firebase.auth().currentUser.uid
        this.subjCollection = firebase.firestore().collection("Users").where("uid", "==", this.uid);
        this.state = {
            subject_list: [],
            image_list: [],
            student_list: [],
            Text_stundent_list: [],
            state_list: [],
            role: "",
            room: "",
            id: "",
            Roomnameadd: "",
            Roomid: "",
            text: "",
            name: ""
        };
    }
    getCollection = (querySnapshot) => {
        const { route } = this.props;
        let checkrole = "";
        let checkroom = "";
        let checkid = "";
        let keepname = "";
        this.setState({ Roomnameadd: route.params.Roomname })

        querySnapshot.forEach((res) => {
            const { Role, room_name, first_name, last_name } = res.data();
            checkrole = Role
            checkroom = room_name
            checkid = res.id
            keepname = first_name + " " + last_name
            this.setState({ role: checkrole, room: checkroom, id: checkid, name: keepname })
        }
        );
        const all_data = [];
        firebase.firestore()
            .collection('Room')
            .where('RoomName', '==', route.params.Roomname)
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((res) => {
                    const { RoomName, building, desc, floor, id, image_room, price, student, state, Text_stundent } = res.data();
                    all_data.push({ RoomName: RoomName, building: building, floor: floor, image_room: image_room, state: state, desc: desc, id: id, desc: desc, price: price, student: student, Text_stundent: Text_stundent, checkroomid: res.id });
                });
                this.setState({ subject_list: all_data, });
                this.setState({ image_list: all_data[0].image_room, });
                this.setState({ student_list: all_data[0].student, });
                this.setState({ Text_stundent_list: all_data[0].Text_stundent, });
                this.setState({ state_list: all_data[0].state, });
                this.setState({ Roomid: all_data[0].checkroomid })
            });
    };
    componentDidMount() {
        this.unsubscribe =
            this.subjCollection.onSnapshot(this.getCollection);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    addinRoom(id) {
        console.log(this.state)
        const db = firebase.firestore();
        db.collection("Users").doc(id).update({
            room_name: this.state.Roomnameadd,
        })
        db.collection("Room").doc(this.state.Roomid).update({
            Text_stundent: firebase.firestore.FieldValue.arrayUnion(this.state.text),
            student: firebase.firestore.FieldValue.arrayUnion(this.state.name),
            state: firebase.firestore.FieldValue.arrayUnion("wait")
        })
        alert("ลงชื่อจองห้องสำเร็จ")
        this.setState({ text: "" })
        const { navigation } = this.props;
        navigation.navigate('ScreenAnnoucement')
    }

    confirm() {
        const db = firebase.firestore();
        db.collection("Room").doc(this.state.Roomid).update({
            state: firebase.firestore.FieldValue.arrayRemove("wait")
        })
        db.collection("Room").doc(this.state.Roomid).update({
            state: firebase.firestore.FieldValue.arrayUnion("confirm")
        })
        alert("ยืนยันการจองห้องพักสำเร็จ");
        const { navigation } = this.props;
        navigation.navigate('Sceeenselect')
    }

    fail() {
        const db = firebase.firestore();
        db.collection("Room").doc(this.state.Roomid).update({
            state: firebase.firestore.FieldValue.arrayRemove("confirm")
        })
        db.collection("Room").doc(this.state.Roomid).update({
            state: firebase.firestore.FieldValue.arrayUnion("fail")
        })
        alert("ยกเลิกการจองห้องพักสำเร็จ");
        const { navigation } = this.props;
        navigation.navigate('Sceeenselect')
    }

    render() {
        return (
            < ScrollView style={styles.container} >
                {this.state.image_list.map((item, i) => (
                    <View key={i} style={{
                        backgroundColor: "white",
                        height: 200,
                        width: '90%',
                        overflow: "hidden",
                        borderRadius: 20,
                        alignSelf: "center",
                        marginBottom: 20,
                    }}>
                        <Image source={{ uri: item }} style={{ height: 200 }}>
                        </Image>
                    </View>
                ))}
                {this.state.subject_list.map((item, i) => (
                    <View key={i} style={{ marginTop: 10 }}>
                        <View>
                            <SafeAreaView style={styles.description}>
                                <Text style={{ padding: 10, textAlign: 'center' }}>
                                    รายละเอียดห้องพัก
                                </Text>
                                <Text style={{ padding: 10 }}>
                                    {item.desc}
                                </Text>
                            </SafeAreaView>
                        </View>
                    </View>
                ))}
                <View style={{ alignItems: "center", marginBottom: 20, }}>
                    <Card style={{
                        borderRadius: 15, width: "95%", marginBottom: 10,
                    }} >
                        <Card.Content
                        ><Title style={{ fontSize: 15, textAlign: 'center' }}>รายชื่อนักศึกษา </Title>
                            {this.state.student_list.map((item, i) => (
                                <Paragraph key={i} style={{ fontSize: 15 }}>{i + 1}. {item}</Paragraph>
                            ))}
                            <Title style={{ fontSize: 15, textAlign: 'center' }}>คำแนะนำตัว </Title>
                            {this.state.Text_stundent_list.map((item, i) => (
                                <Paragraph key={i} style={{ fontSize: 15 }}>{i + 1}. {item}</Paragraph>
                            ))}
                            <Title style={{ fontSize: 15, textAlign: 'center' }}>สถานะ </Title>
                            {this.state.state_list.map((item, i) => (
                                <View key={i} style={{ flexDirection: "row" }}>
                                    <Paragraph style={{ fontSize: 15 }}>{i + 1}. {item}</Paragraph>
                                    <Text style={{ color: "green", marginLeft: 10, marginTop: 2, display: item != "confirm" && this.state.role == "admin" ? "flex" : "none" }} onPress={() => this.confirm()}  >ยืนยัน</Text>
                                    <Text style={{ color: "red", marginLeft: 10, marginTop: 2, display: this.state.role == "admin" ? "flex" : "none" }} onPress={() => this.fail()}  >ยกเลิก</Text>
                                </View>
                            ))}
                        </Card.Content>
                    </Card>
                    <TextInput
                        style={{ backgroundColor: "white", padding: 5, borderRadius: 10, width: "60%", marginTop: "2.5%", textAlign: 'center', borderWidth: 1 }}
                        placeholder="คอมเมนท์ที่เราอยากบอก รูมเมจ"
                        onChangeText={(detail) => this.setState({
                            text: detail
                        })}
                        value={this.state.text} />
                    <Button
                        title="ลงชื่อเข้าหอพัก"
                        color="#594545"
                        onPress={() => this.addinRoom(this.state.id)}
                        style={{ display: this.state.room != "" ? "flex" : "none" }}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFDA79",
        width: "100%"
    },
    description: {
        backgroundColor: "white",
        borderRadius: 20,
        width: "90%",
        height: "100%",
        alignSelf: "center",
        flex: 1,
        marginBottom: 30,
        borderRadius: 15,
        elevation: 15,
        padding: 10,
    }
});