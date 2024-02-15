import { Text, TextInput, View, StyleSheet, Alert, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import DataTable, { COL_TYPES } from 'react-native-datatable-component';
import React, { useState } from "react";
import firebase from '../Database/firebaseDB'
import ModalDropdown from 'react-native-modal-dropdown';

export const ScoreTable = () => {
    const [text, onChangeText] = useState("");
    const [userdata, setuserdata] = useState([]);
    const [adddetail_score, setaddDetail_score] = useState('');
    const [score_begin, setscore_begin] = useState(0);
    const [Score_input, setScore_input] = useState(0);
    const [name, setName] = useState("");
    const [uid_edit, setUid_edit] = useState("");
    const [selecttype, setSelecttype] = useState("เพิ่มคะแนน");
    const all_data = [];

    const alltype = ['เพิ่มคะแนน', 'ลดคะแนน'];
    const [keep, setKeep] = useState("");

    firebase.firestore()
        .collection('Users')
        .where('Role', '==', 'user')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((res) => {
                const { first_name, last_name, score, student_id, score_details, } = res.data();
                all_data.push({ รายชื่อนักศึกษา: first_name + " " + last_name, รหัสนักศึกษา: student_id, คะแนน: score, score_details: score_details, uid: res.id });
            });
            setuserdata(all_data);
        });

    let data_table = userdata;
    if (text[0] in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
        data_table = userdata.filter(x => String(x.รหัสนักศึกษา).includes(text));
    }
    else {
        data_table = userdata.filter(x => String(x.รายชื่อนักศึกษา).includes(text));

    }
    const Detail = (row) => {
        Alert.alert(
            "รายละเอียดการให้คะแนน",
            `${JSON.parse(JSON.stringify((row.score_details)))}`,
            [
                {
                    text: 'เลือก',
                    onPress: () => {
                        setUid_edit(row.uid)
                        setName(row.รายชื่อนักศึกษา)
                        setscore_begin(row.คะแนน)
                    }
                },
                {
                    text: 'กลับ'
                }
            ],
        )
    }

    const add = () => {
        const db = firebase.firestore();
        const value1 = parseInt(score_begin);
        const value2 = parseInt(Score_input)
        if (selecttype == "เพิ่มคะแนน") {
            db.collection("Users").doc(uid_edit).update({
                score: value1 + value2,
                score_details: firebase.firestore.FieldValue.arrayUnion(adddetail_score + ` (+${value2} คะแนน)`)
            })
        }
        else {
            db.collection("Users").doc(uid_edit).update({
                score: value1 - value2,
                score_details: firebase.firestore.FieldValue.arrayUnion(adddetail_score + ` (-${value2} คะแนน)`)
            })
        }
        alert("ให้คะแนนสำเร็จ")
        setUid_edit('');
        setName('');
        setScore_input(0)
        setaddDetail_score('')
        setSelecttype('เพิ่มคะแนน')
    }
    const back = () => {
        setUid_edit('')
        setKeep('')
    }
    const Settings =
        [
            { name: 'รายชื่อนักศึกษา', type: COL_TYPES.STRING, },
            { name: 'รหัสนักศึกษา', type: COL_TYPES.STRING, },
            { name: 'คะแนน', type: COL_TYPES.STRING, },
            { name: 'รายละเอียดการให้คะแนน', type: COL_TYPES.Button, },
        ]
    const nameOfCols = ['รายชื่อนักศึกษา', 'รหัสนักศึกษา', "คะแนน", "รายละเอียดการให้คะแนน"];

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#FFDA79' }}>
            <TextInput placeholder="ชื่อหรือรหัสนักศึกษา" style={styles.input}
                onChangeText={onChangeText}
                value={text}
            />
            <View style={{ margin: 20, }}>
                <DataTable
                    colSettings={Settings}
                    noOfPages="1"
                    onRowSelect={(row) => {
                        Detail(row);
                        setKeep(row.รายชื่อนักศึกษา)
                    }}
                    backgroundColor=""
                    data={data_table}
                    colNames={nameOfCols}
                    headerLabelStyle={{ color: 'grey', fontSize: 10 }}
                />
            </View>
            <SafeAreaView style={{ width: "90%", backgroundColor: "#FFB053", borderRadius: 10, alignSelf: 'center', marginBottom: 20, overflow: "hidden" }}>
                <View style={{ padding: 20 }}>
                    <View style={{ width: "90%" }}>
                        <Text style={{ padding: 20, fontSize: 18, display: uid_edit == '' ? 'flex' : 'none', alignSelf: 'center' }}> โปรดเลือกนักศึกษา ที่ให้คะแนน</Text>
                        <Text style={{ padding: 20, fontSize: 18, display: uid_edit != '' ? 'flex' : 'none', alignSelf: 'center' }}> นักศึกษาที่เลือก : {keep}</Text>
                        <TouchableOpacity style={{ display: uid_edit != '' ? 'flex' : 'none' }} onPress={back} >
                            <View style={{ backgroundColor: "red", borderRadius: 10, width: "40%", alignSelf: "center", marginVertical: 10, marginTop: "2.5%" }}>
                                <Text style={{ color: "white", alignSelf: "center", fontSize: 16, }}>
                                    ยกเลิก
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={{ backgroundColor: "white", padding: 5, borderRadius: 10, width: "60%", alignSelf: 'center', marginTop: "2.5%", textAlign: 'center', borderWidth: 1 }}
                        placeholder="รายละเอียดการให้คะแนน"
                        onChangeText={(score_details) => setaddDetail_score(score_details)}
                        value={adddetail_score} />

                    <TextInput
                        style={{ backgroundColor: "white", padding: 5, borderRadius: 10, width: "60%", alignSelf: 'center', marginTop: "2.5%", textAlign: 'center', borderWidth: 1 }}
                        placeholder="จำนวนคะแนน"
                        keyboardType="numeric"
                        onChangeText={(score) => setScore_input(score)}
                        value={Score_input} />

                    <ModalDropdown options={alltype}
                        defaultValue={"ประเภท ของการให้คะแนน"}
                        textStyle={{ fontSize: 14 }}
                        dropdownStyle={{ width: "50%", borderRadius: 10, backgroundColor: "white", height: 70, overflow: "hidden", marginTop: -23 }}
                        defaultTextStyle={{ color: "#Bbbbbd", paddingHorizontal: 10 }}
                        style={{ backgroundColor: "white", borderRadius: 10, width: "60%", alignSelf: "center", marginTop: "2.5%", textAlign: 'center', borderWidth: 1, padding: 5 }}
                        onSelect={(type) => setSelecttype(alltype[type])}
                        value={selecttype}
                    />

                    <TouchableOpacity onPress={add} >
                        <View style={{ backgroundColor: "#77CF32", padding: 5, borderRadius: 10, width: "40%", alignSelf: "center", marginVertical: 10, marginTop: "2.5%" }}>
                            <Text style={{ color: "white", alignSelf: "center", fontSize: 16, }}>
                                ยืนยัน
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScrollView >
    )
}

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 15,
        borderWidth: 1,
        padding: 10,
        width: "40%",
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "#FFB053"
    },
});
export default ScoreTable;