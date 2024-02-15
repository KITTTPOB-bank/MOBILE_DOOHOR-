import React, { useEffect, useReducer, useState } from "react";
import { StyleSheet, View, Image, TouchableOpacity } from "react-native";

import imgDooHor from "../../assets/logoDooHor.png";
import { FontAwesome, MaterialIcons, Ionicons, Octicons } from "@expo/vector-icons";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ScreenSendOffice_Documents from '../screens/SendOffice_Documents'
import ScreenHor from "../screens/SelectHor";
import ScreenRegister from "../screens/Registration";
import ScreenLogin from "../screens/Login";
import { ScoreTable } from "../screens/ScoreTable";
import ScreenDetailroom from "../screens/Detailroom"
import ScreenNotification from "../screens/Notification";
import ScreenProflie from "../screens/Profile";
import ScreenAnnoucement from "../screens/Announcement";
import ScreenRegisTable from "../screens/RegisTable"
import ScreenGeneralTopic from "../screens/GeneralTopic";
import Sceeenchat from "../screens/chat"
import Sceeenselect from "../screens/select"
import firebase from '../Database/firebaseDB'
import ReadAuth from '../screens/ReadAuth'
import Table_check from "../screens/Table_check"
import Create_Announcement from '../screens/Create_Announcement'
const Stack = createNativeStackNavigator();

function NavBar() {
    const linkTo = useNavigation();
    const [isRole, setIsRole] = useState("")
    const uid = firebase.auth().currentUser.uid
    const getdatafriebase = firebase.firestore().collection("Users").where('uid', '==', uid)


    const logout = () => {
        firebase.auth().signOut().then(() => {
            alert("Already logout")
            linkTo.navigate("ScreenLogin");
        })
    }

    getdatafriebase.get().then(querySnapshot => {
        let all_data = ""
        querySnapshot.forEach((res) => {
            const { Role } = res.data();
            all_data = Role
        });
        setIsRole(all_data)
    });

    return (
        <View style={{ backgroundColor: "#FFDA79" }}>
            <View
                style={{
                    flex: 0,
                    alignItems: "center",
                    height: 10,
                    padding: 10,
                    flexDirection: "row",
                    backgroundColor: "white",
                    borderRadius: 20,
                    justifyContent: "space-between",
                    marginHorizontal: 20,
                    paddingVertical: 20,
                    marginTop: 40,
                    marginBottom: 40
                }}
            >
                <View style={{ display: "flex", flexDirection: "row" }}>
                    <TouchableOpacity style={{ position: "absolute", top: -16 }}
                        onPress={() => { linkTo.navigate("ScreenAnnoucement"); }}>
                        <Image
                            source={imgDooHor}
                            style={{ resizeMode: "contain", width: 100, height: 35 }}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ display: "flex", flexDirection: "row" }}>


                    <Ionicons
                        name="chatbubble-outline"
                        size={24}
                        color="black"
                        style={{ position: "absolute", left: -80, top: -13, display: isRole == "admin" ? "flex" : "none" }}
                        onPress={() => {
                            linkTo.navigate("ScreenHor");
                        }}
                    />
                    <MaterialIcons
                        name="edit" size={25}
                        color="black"
                        style={{ position: "absolute", left: -55, top: -13, display: isRole == "admin" ? "flex" : "none" }}
                        onPress={() => {
                            linkTo.navigate("ScreenNotification");
                        }}
                    />
                    <Ionicons
                        name="md-exit-outline"
                        size={24}
                        color="black"
                        style={{ position: "absolute", left: -25, top: -13, display: isRole == "admin" ? "flex" : "none" }}
                        onPress={logout}

                    />

                    <Ionicons
                        name="chatbubble-outline"
                        size={24}
                        color="black"
                        style={{ position: "absolute", left: -80, top: -13, display: isRole == "admin" ? "none" : "flex" }}
                        onPress={() => {
                            linkTo.navigate("Sceeenchat");
                        }}
                    />

                    <Ionicons
                        name="chatbubble-outline"
                        size={24}
                        color="black"
                        style={{ position: "absolute", left: -80, top: -13, display: isRole == "admin" ? "flex" : "none" }}
                        onPress={() => {
                            linkTo.navigate("ReadAuth");
                        }}
                    />
                    <FontAwesome
                        name="user"
                        size={25}
                        color={"black"}
                        style={{ position: "absolute", left: -50, top: -13, display: isRole == "admin" ? "none" : "flex" }}
                        onPress={() => {
                            linkTo.navigate("ScreenProflie");
                        }}
                    />
                    <Ionicons
                        name="md-exit-outline"
                        size={24}
                        color="black"
                        style={{ position: "absolute", left: -25, top: -13, display: isRole == "admin" ? "none" : "flex" }}
                        onPress={logout}
                    />
                </View>
            </View>
        </View>
    );
}

export default function Navigator() {
    const [user, setUser] = useState(null)
    useEffect(() => {
        setInterval(() => {

            setUser(firebase.auth().currentUser)
        }, 3000)
    }, [])
    return (
        <>
            <NavigationContainer>
                {user ? (<NavBar />) : (<></>)}
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="ScreenLogin" component={ScreenLogin} />
                    <Stack.Screen name="ScreenNotification" component={ScreenNotification} />
                    <Stack.Screen name="ScreenHor" component={ScreenHor} />
                    <Stack.Screen name="ScreenRegister" component={ScreenRegister} />
                    <Stack.Screen name="ScoreTable" component={ScoreTable} />
                    <Stack.Screen name="ScreenProflie" component={ScreenProflie} />
                    <Stack.Screen name="ScreenDetailroom" component={ScreenDetailroom} />
                    <Stack.Screen name="ScreenSendOffice_Documents" component={ScreenSendOffice_Documents} />
                    <Stack.Screen name="ScreenAnnoucement" component={ScreenAnnoucement} />
                    <Stack.Screen name="ScreenRegisTable" component={ScreenRegisTable} />
                    <Stack.Screen name="ScreenGeneralTopic" component={ScreenGeneralTopic} />
                    <Stack.Screen name="Sceeenchat" component={Sceeenchat} />
                    <Stack.Screen name="Sceeenselect" component={Sceeenselect} />
                    <Stack.Screen name="ReadAuth" component={ReadAuth} />
                    <Stack.Screen name="Table_check" component={Table_check} />
                    <Stack.Screen name="Create_Announcement" component={Create_Announcement} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    );
}

const styles = StyleSheet.create({});



