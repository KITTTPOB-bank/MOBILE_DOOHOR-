import { Text, TextInput, View, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import DataTable, { COL_TYPES } from 'react-native-datatable-component';
import ModalDropdown from 'react-native-modal-dropdown';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome5 } from '@expo/vector-icons';

import React from "react";
import firebase from '../Database/firebaseDB'
export default function SendOffice_Documents() {
    const [text, onChangeText] = React.useState("");
    const [userdata, setuserdata] = React.useState([]);
    const [selecttype, setSelecttype] = React.useState("General");
    const [title_input, setTitle] = React.useState("");
    const [desc_input, setDesc] = React.useState("");
    const [dormitory_bill_input, setDormitory_bill] = React.useState("");
    const [electricity_bill_input, setElectricity_bill] = React.useState("");
    const [water_bill_input, setWater_bill] = React.useState("");
    const [image_documents, setImage_documents] = React.useState(null);
    const [picture_from_user, setPicture_from_user] = React.useState("");
    const [uid_input, setUid] = React.useState("");
    const todoRef = firebase.firestore().collection("office_documents");

    //////////////////////////////////////////
    const [check, setCheck] = React.useState(true);
    const [keep, setKeep] = React.useState('');

    const alltype = ['Bill', 'General', 'Petition'];
    const all_data = []

    firebase.firestore()
        .collection('Users')
        .where('Role', '==', 'user')
        .get()
        .then(querySnapshot => {
            querySnapshot.forEach((res) => {
                const { first_name, last_name, student_id, room_name, uid } = res.data();
                all_data.push({ ชื่อนักศึกษา: first_name + " " + last_name, รหัสนักศึกษา: student_id, ห้อง: room_name, uid: uid, });
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
            { name: 'ห้อง', type: COL_TYPES.STRING, },
            { name: 'เลือกส่ง', type: COL_TYPES.Button, },
        ]
    const nameOfCols = ['ชื่อนักศึกษา', 'รหัสนักศึกษา', "ห้อง", "เลือกส่ง"];

    const back = () => {
        setCheck(true)
    }

    const add = async () => {
        const response = await fetch(image_documents.uri)
        const blob = await response.blob();
        const filename = image_documents.uri
        var ref1 = firebase.storage().ref().child(filename).put(blob);
        try {
            await ref1;

        }
        catch (e) {
            console.log(e)
        }
        alert(
            'ส่งข้อมูลสำเร็จ'
        )
        setImage_documents(null)
        const data = {
            type: selecttype,
            title: title_input,
            desc: desc_input,
            dormitory_bill: dormitory_bill_input,
            electricity_bill: electricity_bill_input,
            water_billi: water_bill_input,
            uid: uid_input,
            image_documents: filename,
            picture_from_user: picture_from_user
        }
        todoRef.add(data)
        setCheck(true)

    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })
        const source = { uri: result.uri };
        setImage_documents(source);
    };


    return (
        <ScrollView style={{ backgroundColor: "#FFDA79", width: "100%", height: "100%" }}>
            <View style={{ margin: 20, display: check ? 'flex' : 'none' }} >
                <View style={{ backgroundColor: "#FFB053", width: "100%", borderRadius: 10, padding: 10 }}>
                    <View style={{ flexDirection: "row", alignSelf: 'center' }}>
                        <FontAwesome5 name="user-graduate" size={24} color="black" />
                        <Text style={{ fontSize: 20, paddingLeft: 5 }}>ตารางนักศึกษา </Text>
                    </View>
                    <Text style={{ fontSize: 14, marginTop: 10 }}>สำหรับ ส่งข้อมูลทั่วไป ใบเสร็จ หรือคำร้องไปให้นักศึกษา</Text>
                </View>
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
                    headerLabelStyle={{ color: 'grey', fontSize: 13 }}
                    onRowSelect={(row) => {
                        setUid(row.uid)
                        setKeep(row.ชื่อนักศึกษา)
                        setCheck(false)
                    }}
                />
            </View>
            <SafeAreaView style={{ width: "90%", backgroundColor: "pink", borderRadius: 10, alignSelf: 'center', display: check ? 'none' : 'flex', overflow: "hidden" }}>
                <View style={{ padding: 20, backgroundColor: "#FFB053", }}>
                    <Text style={{ fontSize: 20 }}>{keep}</Text>
                    <ModalDropdown options={alltype}
                        defaultValue={"ประเภท ของการส่ง"}
                        textStyle={{ paddingLeft: 5, paddingBottom: 5, fontSize: 14, paddingTop: 3 }}
                        dropdownStyle={{ width: "40%", borderRadius: 10, backgroundColor: "white", height: 70, overflow: "hidden", marginTop: -20 }}
                        defaultTextStyle={{ color: "#Bbbbbd" }}
                        style={{ backgroundColor: "white", borderRadius: 10, width: "50%", justifyContent: "center", marginTop: 10 }}
                        onSelect={(type) => setSelecttype(alltype[type])}
                        value={selecttype}
                    />
                </View>
                <View style={{ padding: 20, backgroundColor: "#fff", }}>
                    <Text style={{ fontSize: 15 }}> กรอกข้อมูลสำหรับการส่ง</Text>
                    <TextInput
                        style={{ backgroundColor: "#FFDA79", borderRadius: 10, width: "50%", marginVertical: 5, textAlign: "center" }}
                        placeholder="หัวข้อ"
                        placeholderTextColor="#6e6e6e"
                        onChangeText={(title) => setTitle(title)}
                        value={title_input} />

                    <TextInput
                        style={{ backgroundColor: "#FFDA79", borderRadius: 10, width: "50%", marginVertical: 5, textAlign: "center" }}
                        placeholder="รายละเอียด"
                        placeholderTextColor="#6e6e6e"
                        onChangeText={(desc) => setDesc(desc)}
                        value={desc_input} />

                    <TextInput
                        style={{ backgroundColor: "#FFDA79", borderRadius: 10, width: "50%", display: selecttype == 'Bill' ? 'flex' : 'none', marginVertical: 5, textAlign: "center" }}
                        placeholder="ค่าหอพัก"
                        placeholderTextColor="#6e6e6e"
                        onChangeText={(dormitory_bill) => setDormitory_bill(dormitory_bill)}
                        value={dormitory_bill_input} />

                    <TextInput
                        style={{ backgroundColor: "#FFDA79", borderRadius: 10, width: "50%", display: selecttype == 'Bill' ? 'flex' : 'none', marginVertical: 5, textAlign: "center" }}
                        placeholder="ค่าไฟฟ้า"
                        placeholderTextColor="#6e6e6e"
                        onChangeText={(electricity_bill) => setElectricity_bill(electricity_bill)}
                        value={electricity_bill_input} />

                    <TextInput
                        style={{ backgroundColor: "#FFDA79", borderRadius: 10, width: "50%", display: selecttype == 'Bill' ? 'flex' : 'none', marginVertical: 5, textAlign: "center" }}
                        placeholder="ค่าน้ำ"
                        placeholderTextColor="#6e6e6e"
                        onChangeText={(water_bill) => setWater_bill(water_bill)}
                        value={water_bill_input} />

                    <TouchableOpacity onPress={pickImage}>
                        <View style={{ padding: 5, flexDirection: "row" }}>
                            <Text style={{ fontSize: 15, padding: 5 }}>รูปภาพข้อมูลที่จะส่ง</Text>
                            <AntDesign name="upload" size={20} color="black" style={{ backgroundColor: "white", padding: 5, borderRadius: 10, marginLeft: 2, overflow: "hidden" }} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={add} >
                        <View style={{ backgroundColor: "#3ea100", padding: 5, borderRadius: 10, width: "40%", alignSelf: "center", marginVertical: 10 }}>
                            <Text style={{ color: "white", alignSelf: "center", fontSize: 16 }}>
                                ยืนยัน
                            </Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={back}>
                        <View style={{ backgroundColor: "#d11313", padding: 5, borderRadius: 10, width: "40%", alignSelf: "center", marginVertical: 10 }}>
                            <Text style={{ color: "white", alignSelf: "center", fontSize: 16 }}>
                                ยกเลิก
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
        width: "70%",
        margin: 15,
        borderWidth: 2,
        borderColor: "#FFB053",
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10
    },
});