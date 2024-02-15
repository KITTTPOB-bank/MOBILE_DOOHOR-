import React, { Component, } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import firebase from '../Database/firebaseDB'
import ModalDropdown from 'react-native-modal-dropdown';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';

export default function (props) {
    const navigation = useNavigation();
    return <Room {...props} navigation={navigation} />;
}
class Room extends Component {
    constructor() {
        super()
        this.subjCollection = firebase.firestore().collection("Check")
        this.state = {
            subject_list: [],
            selecttype: "ชั้นที่ 1",
            alltype: ['ชั้นที่ 1', 'ชั้นที่ 2', 'ชั้นที่ 3', 'ชั้นที่ 4'],
            check: '',
        }
    }
    getCollection = (querySnapshot) => {
        const check = [];
        querySnapshot.forEach((res) => {
            const { building } = res.data();
            check.push({ building: building, });
        }
        );
        console.log(check[0].building)
        const user = firebase.auth().currentUser
        if (true) {
            const all_data = [];
            firebase.firestore()
                .collection('Room').where('building', '==', check[0].building)
                .get()
                .then(querySnapshot => {
                    querySnapshot.forEach((res) => {
                        const { RoomName, student, floor, pos } = res.data();
                        all_data.push({ RoomName: RoomName, student: student.length, floor: floor, pos: pos });
                    });
                    this.setState({ subject_list: all_data, });
                });
        }
        else { }
    };

    componentDidMount() {
        this.unsubscribe =
            this.subjCollection.onSnapshot(this.getCollection);
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    GotoRoom(name) {
        const { navigation } = this.props;
        navigation.navigate('ScreenDetailroom',
            {
                Roomname: name
            })
    };

    render() {
        return (
            <View>
                <View style={{ marginTop: "5%" }} >
                    <View style={{ flexDirection: "row", alignSelf: "center", backgroundColor: "#242424", width: "90%", padding: 10, borderRadius: 20 }}>
                        <View style={{ flexDirection: "row", marginHorizontal: "15%" }}>
                            <FontAwesome name="circle" size={24} color="#DF727D" />
                            <Text style={{ paddingLeft: 5, fontWeight: "bold", color: "white", fontSize: 15 }}>เต็ม</Text>
                        </View>
                        <View style={{ flexDirection: "row", marginHorizontal: "15%" }}>
                            <FontAwesome name="circle" size={24} color="#6663F6" />
                            <Text style={{ paddingLeft: 5, fontWeight: "bold", color: "white", fontSize: 15 }}>ไม่เต็ม</Text>
                        </View>
                    </View>
                    <ModalDropdown options={this.state.alltype}
                        defaultValue={"เลือกชั้น"}
                        textStyle={{ paddingLeft: 5, paddingBottom: 5, fontSize: 14, paddingTop: 5 }}
                        dropdownStyle={{ width: "35%", borderRadius: 10, backgroundColor: "white", height: 100, overflow: "hidden", marginTop: -20 }}
                        defaultTextStyle={{ color: "#Bbbbbd" }}
                        style={{ backgroundColor: "white", borderRadius: 10, width: "40%", marginTop: '10%', alignSelf: "center", borderWidth: 1 }}
                        onSelect={(type) =>
                            this.setState({
                                selecttype: this.state.alltype[type]
                            })
                        }
                        value={this.state.selecttype}
                    />
                </View>
                {this.state.subject_list.map((item, i) => (
                    <View key={i}>
                        <TouchableOpacity onPress={() => this.GotoRoom(item.RoomName)} style={{ marginTop: 10, display: item.floor == this.state.selecttype && item.pos == 'R' ? 'flex' : 'none' }} >
                            <View style={{
                                flexDirection: "row",
                                backgroundColor: item.student == 4 ? '#DF727D' : '#6663F6', padding: 5, borderRadius: 10, width: "35%", alignSelf: "center", marginVertical: 10
                            }}>
                                <Text style={{ color: "white", alignSelf: "center", fontSize: 16, marginLeft: '18%' }}>
                                    {item.RoomName}
                                </Text>
                                <Text style={{ color: "white", alignSelf: "center", fontSize: 12, marginLeft: 10 }}>
                                    {item.student} / 4
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
                }
            </View>
        )
    }
}