import { Text, TextInput, View, StyleSheet, Alert, TouchableOpacity,ScrollView } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import React, { useState, useEffect } from "react";
import firebase from '../Database/firebaseDB'
export default function Create_Announcement() {
    const [selecttype, setSelecttype] = React.useState("Register");
    const [title_input, setTitle] = React.useState("");
    const [desc_input, setDesc] = React.useState("");
    const [alldesc_input, setallDesc] = React.useState("");
    const [image, setImage] = React.useState(null);
    const alltype = ['Room', 'Register', 'General'];
    const db = firebase.firestore();

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        })
        const source = { uri: result.uri };
        setImage(source);
        alert("อัปโหลดรูปภาพสำเร็จ")
    };
    const add = async () => {
        const response = await fetch(image.uri)
        const blob = await response.blob();
        const filename = image.uri
        let ref1 = firebase.storage().ref().child(filename).put(blob);
        let m = Math.floor(Math.random() * 100) + 1
        try {
            await ref1;
        }
        catch (e) {
            console.log(e)
        }

        Alert.alert(
            'เพิ่มประกาศสำเร็จ'
        )
        /// doc เป็นชื่อของ ตารางประกาศรีจิสกับประกาศห้อง 2 type นี้จะไม่ลบแต่แค่แก้ไขเปลี่ยนสเตจ
        if (selecttype == 'Register') {
            db.collection("declaration").doc("Bfju2YmnuNB8gDcc7wmn").update({
                title: title_input,
                desc: desc_input,
                state: 'open',
                image: filename
            })
        }
        else if (selecttype == 'Room') {
            db.collection("declaration").doc("aYeT9KpFNdP2d2dDcYa9").update({
                title: title_input,
                desc: desc_input,
                state: 'open',
                image: filename,
                id: m
            })
        }
        else {
            db.collection("declaration").add({
                title: title_input,
                desc: desc_input,
                state: 'open',
                image: filename,
                all_desc: alldesc_input,
                id: m,
                type: "General"
            })
        }
        setTitle("")
        setDesc("")
        setallDesc("")
        setImage("")
    }
    console.log(image)
    return (
        <ScrollView style={{ width: "100%", backgroundColor: "#FFDA79", borderRadius: 10, alignSelf: 'center', flex: 1 }}>
            <View style={{ padding: 20 }}>
                <ModalDropdown options={alltype}
                    defaultValue={"ประเภท ของประกาศ"}
                    textStyle={{ paddingLeft: 5, paddingBottom: 5, fontSize: 14, }}
                    dropdownStyle={{ width: "45%", borderRadius: 10, backgroundColor: "white", height: 110, overflow: "hidden", marginTop: -25 }}
                    defaultTextStyle={{ color: "#Bbbbbd" }}
                    style={{ backgroundColor: "white", borderRadius: 10, width: "50%", justifyContent: "center" }}
                    onSelect={(type) => setSelecttype(alltype[type])}
                    value={selecttype}
                />
            </View>
            <TouchableOpacity onPress={pickImage} style={{
                backgroundColor: "#b8b8b8", borderRadius: 15,
                elevation: 15,
                padding: 10,
                width: "80%",
                height: "40%",
                alignSelf: 'center'
            }}>
                <View style={{ padding: 5, alignSelf: 'center' }} >
                    <AntDesign name="upload" size={24} color="black" style={{ backgroundColor: "white", padding: 5, borderRadius: 10, marginTop: '20%' }} />
                </View>
            </TouchableOpacity>
            <View style={{ padding: 20 }}>

                <TextInput
                    style={{ backgroundColor: "white", padding: 5, borderRadius: 10, width: "50%", }}
                    placeholder="หัวข้อ"
                    onChangeText={(title) => setTitle(title)}
                    value={title_input} />

                <TextInput
                    style={{ backgroundColor: "white", padding: 5, borderRadius: 10, width: "90%", marginTop: "5%" }}
                    placeholder="รายละเอียด"
                    onChangeText={(desc) => setDesc(desc)}
                    value={desc_input} />

                <TextInput
                    style={{ backgroundColor: "white", padding: 5, borderRadius: 10, width: "90%", marginTop: "5%", display: selecttype == 'General' ? "flex" : "none" }}
                    placeholder="รายละเอียด ทั้งหมด"
                    onChangeText={(alldesc_input) => setallDesc(alldesc_input)}
                    value={alldesc_input} />


                <TouchableOpacity onPress={add} >
                    <View style={{ backgroundColor: "#77CF32", padding: 5, borderRadius: 10, width: "40%", alignSelf: "center", marginVertical: 10, marginBottom: "15%" }}>
                        <Text style={{ color: "white", alignSelf: "center", fontSize: 16 }}>
                            ยืนยัน
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFDA79",
    },
    img: {
        width: "80%",
        height: 150,
        resizeMode: "cover",
        alignSelf: "center",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
});