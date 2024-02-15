import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import firebase from '../Database/firebaseDB'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { useNavigation } from "@react-navigation/native";

export default function Login() {
    const [email, setEmail] = useState({ value: '', error: '' })
    const [password, setPassword] = useState({ value: '', error: '' })
    const navigation = useNavigation();
    const onLoginPressed = () => {
        firebase
            .auth()
            .signInWithEmailAndPassword(email.value, password.value)
            .then((res) => {
                alert("ล็อนอินสำเร็จแล้ว")
                setEmail({ value: '', error: '' })
                setPassword({ value: '', error: '' })
            })
        navigation.navigate("ScreenAnnoucement")
    }

    const onPressed = () => {
        navigation.navigate("ScreenAnnoucement")
    }

    return (
        <SafeAreaView style={{ width: "100%", backgroundColor: "#FFB053", height: "100%" }} >
            <KeyboardAwareScrollView extraHeight={100}>
                <View style={{ paddingTop: "50%" }}>
                    <Text style={styles.logintext}>Login</Text>
                    <TextInput style={styles.inputContainer} placeholder="Username" value={email.value} keyboardType="email-address"
                        onChangeText={(text) => setEmail({ value: text, error: '' })}
                    />
                    <TextInput style={styles.inputContainer} value={password.value}
                        placeholder="Password" onChangeText={(text) => setPassword({ value: text, error: '' })}
                    />
                    <View style={styles.buttonLogin}>
                        <TouchableOpacity onPress={onLoginPressed}>
                            <View style={{ backgroundColor: "transparent", padding: 5, borderRadius: 5, flexDirection: "row" }}>
                                <Text style={{ color: "white", fontSize: 18 }}>
                                    Login
                                </Text>
                                <AntDesign name="caretright" size={24} color="#FFE664" />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.buttonGuest}>
                        <TouchableOpacity onPress={onPressed}>
                            <View style={{ backgroundColor: "transparent", padding: 5, borderRadius: 5, flexDirection: "row" }}>
                                <Text style={{
                                    color: "white", fontSize: 12.5, textDecorationLine: 'underline'
                                }}>
                                    Guest
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFB053",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%"
    },
    inputContainer: {
        backgroundColor: "white",
        padding: 5,
        borderRadius: 10,
        width: "70%",
        margin: 10,
        fontSize: 20,
        alignSelf: "center"
    },
    logintext: {
        fontSize: 50,
        color: "white",
        paddingBottom: 50,
        fontWeight: "700",
        alignSelf: "center",
    },
    buttonLogin: {
        backgroundColor: "#FF9A3C",
        width: "30%",
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        alignSelf: "center"
    },
    buttonGuest: {
        width: "30%",
        marginTop: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        alignSelf: "center"
    }
});