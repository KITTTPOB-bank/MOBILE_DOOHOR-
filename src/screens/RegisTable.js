import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import DataTable, { COL_TYPES } from 'react-native-datatable-component';
import { Card, Title, Paragraph, TextInput } from 'react-native-paper';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState, useEffect } from "react";
import firebase from '../Database/firebaseDB'

export default function RegisTable() {
    const [text, onChangeText] = useState("");
    const [userdata, setuserdata] = useState([]);
    const [userschoose, setUsersChoose] = useState([]);
    const [check, setCheck] = useState(true);
    const [valueA, setValueA] = useState(0);
    const [valueB, setValueB] = useState(0);
    const [valueC, setValueC] = useState(0);
    const [valueD, setValueD] = useState(0);
    const all_data = []

    firebase.firestore()
        .collection('DataRegister')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((res) => {
                const { firstName, lasstName, student_id, e_mail, age, alley_lane, bit, faculty, houseNo, imgHouse, imgIdCard, imgSelfie, moo, postCode, province, sex, district, subDistrict, village, year, Reason, score } = res.data();
                all_data.push({ ชื่อนักศึกษา: firstName + " " + lasstName, รหัสนักศึกษา: student_id, e_mail: e_mail, age: age, sex: sex, Reason: Reason, imgHouse: imgHouse, imgIdCard: imgIdCard, imgSelfie: imgSelfie, address: houseNo + " " + moo + " " + village + " " + alley_lane + " " + subDistrict + " " + district + " " + province + " " + postCode, education: "คณะ : " + faculty + " สาขา : " + bit + " ปี : " + year, uid: res.id, คะแนน: score });
            });
            setuserdata(all_data);
        });

    let data_table = userdata
    if (text[0] in [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
        data_table = userdata.filter(x => String(x.รหัสนักศึกษา).includes(text));
    }
    else {
        data_table = userdata.filter(x => String(x.ชื่อนักศึกษา).includes(text));
    }

    const Settings =
        [
            { name: 'ชื่อนักศึกษา', type: COL_TYPES.STRING, },
            { name: 'รหัสนักศึกษา', type: COL_TYPES.STRING, },
            { name: 'คะแนน', type: COL_TYPES.STRING, },
            { name: 'เลือกให้คะแนน', type: COL_TYPES.Button, },
        ]
    const nameOfCols = ['ชื่อนักศึกษา', 'รหัสนักศึกษา', "คะแนน", "เลือกให้คะแนน"];

    const add = () => {
        const db = firebase.firestore();
        const score = parseInt(valueA) + parseInt(valueB) + parseInt(valueC) + parseInt(valueD)
        db.collection("DataRegister").doc(userschoose.uid).update({
            score: score
        })
        alert('เพิ่มคะแนนสำเร็จ')
        setValueA(0)
        setValueB(0)
        setValueC(0)
        setValueD(0)
        setCheck(true)
    }

    const back = () => {
        setValueA(0)
        setValueB(0)
        setValueC(0)
        setValueD(0)
        setCheck(true)

    }

    return (
        <View style={{ paddingTop: "5%", backgroundColor: "#FFDA79", height: "100%" }}>
            <View style={{ display: check ? 'flex' : 'none', width: "100%" }} >
                <View style={{ flexDirection: "row", alignSelf: 'center', }}>
                    <FontAwesome5 name="user-graduate" size={24} color="black" />
                    <Text style={{ fontSize: 20, paddingLeft: 5 }}>ตารางนักศึกษา </Text>
                </View>
                <Text style={{ fontSize: 15, marginTop: 10, alignSelf: "center" }}>สำหรับ ให้คะแนนการสมัครเข้าเป็นสมาชิกหอพักของนักศึกษา</Text>
                <TextInput placeholder="ชื่อหรือรหัสนักศึกษา" style={styles.input}
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
                        setCheck(false)
                        setUsersChoose(row)
                    }}
                />
            </View>
            <ScrollView style={{ borderRadius: 10, alignSelf: 'center', display: check ? 'none' : 'flex' }}>
                <Card style={{
                    padding: 20,
                    borderRadius: 15,
                    elevation: 15,
                    padding: 10,
                    width: "90%",
                    alignSelf: 'center',
                    marginBottom: "8%",
                    backgroundColor: "#FFB053"
                }}>
                    <Card.Content>
                        <Title style={{ alignSelf: 'center' }}>ข้อมูลรายละเอียดนักศึกษา</Title>
                        <Paragraph style={{ marginTop: "5%" }}>ชื่อนักศึกษา : {userschoose.ชื่อนักศึกษา} </Paragraph>
                        <Paragraph>รหัสนักศึกษา : {userschoose.รหัสนักศึกษา} </Paragraph>
                        <Paragraph>อายุ : {userschoose.age} เพศ : {userschoose.sex} </Paragraph>
                        <Paragraph>ปัจจุบันกำลังศึกษา : {userschoose.education}</Paragraph>
                        <Paragraph>อีเมลล์ : {userschoose.e_mail}</Paragraph>
                        <Paragraph>ที่อยู่ปัจจุบัน : {userschoose.address}</Paragraph>
                        <Paragraph>เหตุผลการสมัคร : {userschoose.Reason}</Paragraph>
                    </Card.Content>
                    <Card.Cover style={{ width: "90%", height: 200, alignSelf: "center", marginTop: '5%', resizeMode: "contain" }} 
                        source={{ uri: userschoose.imgSelfie }} />
                    <Card.Cover style={{ width: "90%", height: 200, alignSelf: "center", marginTop: '5%', resizeMode: "contain" }} 
                        source={{ uri: userschoose.imgIdCard }} />
                    <Card.Cover style={{ width: "90%", height: 200, alignSelf: "center", marginTop: '5%', resizeMode: "contain" }} 
                        source={{ uri: userschoose.imgHouse }} />
                </Card>
                <Card style={{
                    padding: 20, borderRadius: 15,
                    elevation: 15,
                    padding: 10,
                    width: "90%",
                    alignSelf: 'center',
                    marginTop: "5%",
                    marginBottom: "8%",
                    backgroundColor: "#FFB053"
                }}>
                    <Card.Content>
                        <Title style={{ alignSelf: 'center' }}>ประเมินคะแนนนักศึกษา</Title>
                        <TextInput
                            label="เหตุผลการสมัคร (เต็ม 25)"
                            value={valueA}
                            onChangeText={Number => setValueA(Number)}
                            style={{ width: "100%", marginTop: "5%", alignSelf: "center", height: 40 }}
                        />

                        <TextInput
                            label="ระยะทางบ้าน (เต็ม 25)"
                            value={valueB}
                            onChangeText={Number => setValueB(Number)}
                            style={{ width: "100%", marginTop: "5%", alignSelf: "center", height: 40 }}

                        />
                        <TextInput
                            label="ทุนการศึกษา (เต็ม 25)"
                            value={valueC}
                            onChangeText={Number => setValueC(Number)}
                            style={{ width: "100%", marginTop: "5%", alignSelf: "center", height: 40 }}

                        />
                        <TextInput
                            label="ความเห็นจากคณะ (เต็ม 25)"
                            value={valueD}
                            onChangeText={Number => setValueD(Number)}
                            style={{ width: "100%", marginTop: "5%", alignSelf: "center", height: 40 }}
                        />

                        <TouchableOpacity onPress={add} >
                            <View style={{ marginTop: "5%", backgroundColor: "#77CF32", padding: 5, borderRadius: 10, width: "80%", alignSelf: "center", }}>
                                <Text style={{ color: "white", alignSelf: "center", fontSize: 16 }}>
                                    ยืนยันการการให้คะแนน
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={back} >
                            <View style={{ marginTop: "5%", backgroundColor: "red", padding: 5, borderRadius: 10, width: "80%", alignSelf: "center", }}>
                                <Text style={{ color: "white", alignSelf: "center", fontSize: 16 }}>
                                    กลับไปหน้าตาราง
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </Card.Content>
                </Card>
                <View></View>
            </ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    input: {
        height: 20,
        width: "60%",
        margin: 15,
        borderWidth: 2,
        borderColor: "#FFB053",
        padding: 5,
        backgroundColor: "white",
        borderRadius: 10,
        overflow: "hidden"
    },
});