import { Text, TextInput, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import DataTable, { COL_TYPES } from 'react-native-datatable-component';
import { FontAwesome5 } from '@expo/vector-icons';
import React from "react";
import firebase from '../Database/firebaseDB'

export default function Table_check() {
    const [text, onChangeText] = React.useState("");
    const [document, setDocument] = React.useState([]);
    const [keep, setKeep] = React.useState("https://static.vecteezy.com/system/resources/thumbnails/004/640/699/small/circle-upload-icon-button-isolated-on-white-background-vector.jpg");
    //////////////////////////////////////////
    const [check, setCheck] = React.useState(true);
    const all_data = []

    firebase.firestore()
        .collection('office_documents').where('type', '!=', 'General')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((res) => {
                const { title, type, student_name, picture_from_user } = res.data();
                all_data.push({ หัวข้อ: title, ประเภท: type, ชื่อนักศึกษา: student_name, picture_from_user: picture_from_user });
            });
            setDocument(all_data);
        });

    let data_table = document
    data_table = document.filter(x => x.ชื่อนักศึกษา.includes(text));

    const Settings =
        [
            { name: 'หัวข้อ', type: COL_TYPES.STRING, },
            { name: 'ประเภท', type: COL_TYPES.STRING, },
            { name: 'ชื่อนักศึกษา', type: COL_TYPES.STRING, },
            { name: 'ดูรูปภาพ', type: COL_TYPES.Button, },
        ]
    const nameOfCols = ['หัวข้อ', 'ประเภท', "ชื่อนักศึกษา", "ดูรูปภาพ"];
    const back = () => {
        setCheck(true)
    }

    return (
        <ScrollView style={{ backgroundColor: "#FFDA79", width: "100%", height: "100%" }}>
            <View style={{ margin: 20, display: check ? 'flex' : 'none' }} >
                <View style={{ flexDirection: "row", alignSelf: 'center', }}>
                    <FontAwesome5 name="user-graduate" size={24} color="black" />
                    <Text style={{ fontSize: 20, paddingLeft: 5 }}>ตารางตรวจเอกสาร </Text>
                </View>
                <Text style={{ fontSize: 15, marginTop: 10 }}>สำหรับ เช็คข้อมูล</Text>
                <TextInput placeholder="หัวข้อ" style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                />
                <DataTable
                    colSettings={Settings}
                    noOfPages="1"
                    data={data_table}
                    onclick
                    colNames={nameOfCols}
                    headerLabelStyle={{ color: 'grey', fontSize: 10 }}
                    onRowSelect={(row) => {
                        setKeep(row.picture_from_user)
                        setCheck(false)
                    }}
                />
            </View>
            <SafeAreaView style={{ width: "90%", backgroundColor: "#FFDA79", borderRadius: 10, alignSelf: 'center', display: check ? 'none' : 'flex' }}>
                <View style={{ padding: 20 }}>
                    <View>
                        <View>
                            <Image style={styles.img} source={{ uri: keep }} />
                        </View>
                    </View>
                    <TouchableOpacity onPress={back}  >
                        <View style={{ backgroundColor: "red", padding: 5, borderRadius: 10, width: "40%", alignSelf: "center", marginVertical: 10 }}>
                            <Text style={{ color: "white", alignSelf: "center", fontSize: 16 }}>
                                กลับ
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScrollView >
    )
}
const styles = StyleSheet.create({
    img: {
        width: "80%",
        height: 150,
        resizeMode: "cover",
        borderRadius: 10,
        alignSelf: "center",
    },
});