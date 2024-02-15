import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import firebase from '../Database/firebaseDB'
import { useNavigation } from '@react-navigation/native';

export default function (props) {
    const navigation = useNavigation();
    return <CardHor {...props} navigation={navigation} />;
}

class CardHor extends Component {
    constructor() {
        super();
        this.subjCollection = firebase.firestore().collection("Room")
        this.state = {
            subject_list: [],
        }
    }
    getCollection = () => {

        const all_data = [];
        firebase.firestore()
            .collection('Hor')
            .get()
            .then(querySnapshot => {
                querySnapshot.forEach((res) => {
                    const { building, price, type, sex, desc, image } = res.data();
                    all_data.push({ building: building, price: price, type: type, desc: desc, sex: sex, image: image });
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

    choose(id) {
        const db = firebase.firestore();
        db.collection("Check").doc('uir0tIOJ7Uu4ZNLDQHGW').update({
            building: id
        })
        const { navigation } = this.props;
        navigation.navigate('Sceeenselect')
    }

    render() {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }} >
                {this.state.subject_list.map((item, i) => (
                    <View key={i} style={{ display: item.type == "พัดลม" ? 'flex' : 'none' }}>
                        <TouchableOpacity style={styles.container} onPress={() => this.choose(item.building)}>
                            <View style={{ flexDirection: "row", width: "100%" }}>
                                <Image style={styles.img} source={{ uri: item.image }} />
                                <View style={{ flexDirection: "column", left: 20, top: 10 }}>
                                    <View style={{ flexDirection: "row" }}>
                                        <Text style={{ fontSize: 20, fontWeight: "bold", paddingBottom: 5 }}>หอ : {item.building}</Text>
                                        <Text style={{ fontSize: 20, fontWeight: "bold", left: 45 }}>{item.price} บาท</Text>
                                    </View>
                                    <Text style={{ fontSize: 15, paddingBottom: 5 }}>เพศ : {item.sex}</Text>
                                    <Text style={{ fontSize: 15, paddingBottom: 5 }}>ประเภท : {item.type}</Text>
                                    <Text style={{ fontSize: 15, color: "gray", left: "45%" }}>รายละเอียดหอพัก</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
                }
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: 'wrap',
        width: "90%",
        height: 130,
        backgroundColor: "white",
        borderRadius: 20,
        marginTop: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: {
            width: 0,
            height: 10
        },
    },
    img: {
        width: 130,
        height: 130,
        borderRadius: 20,
        flexWrap: 'wrap',
        resizeMode: "cover",
        overflow: "hidden",
        zIndex: 2
    }
});