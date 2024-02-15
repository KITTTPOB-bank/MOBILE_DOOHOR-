import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import firebase from '../Database/firebaseDB'
import { useNavigation } from '@react-navigation/native';

export default function (props) {
    const navigation = useNavigation();
    return <Announcement {...props} navigation={navigation} />;
}

export default function Announcement(props) {
    const navigation = useNavigation();
    const [subjectList, setSubjectList] = useState([]);

    useEffect(() => {
        const unsubscribe = firebase.firestore()
            .collection('declaration')
            .where('state', '==', "open")
            .onSnapshot(querySnapshot => {
                const allData = [];
                querySnapshot.forEach(res => {
                    const { desc, image, title, type, state, id } = res.data();
                    allData.push({ desc, image, title, type, state, id });
                });
                setSubjectList(allData);
            });

        return () => unsubscribe();
    }, []); // ให้ useEffect ทำงานเมื่อคอมโพเนนต์เริ่มต้น (componentDidMount)

    const screenRegister = () => {
        navigation.navigate('ScreenRegister');
    };

    const screenGeneralTopic = (i) => {
        navigation.navigate('ScreenGeneralTopic', {
            id: i
        });
    };

    const screenHor = () => {
        navigation.navigate('ScreenHor');
    };

    return (
        < ScrollView style={styles.container} >
            <Text>{this.props.id}</Text>
            {this.state.subject_list.map((item, i) => (
                <View key={i} style={{ marginTop: '5%' }}>
                    <View style={{ display: item.type == 'Register' ? 'flex' : 'none' }}>
                        <TouchableOpacity onPress={() => this.ScreenRegister()}>
                            <Image style={styles.img} source={{ uri: item.image }} />
                            <SafeAreaView style={styles.description}>
                                <Text style={{ padding: 10 }}>
                                    {item.title} : {item.desc}   ...กดเพื่อดูรายละเอียดเพิ่มเติม
                                </Text>
                            </SafeAreaView>
                        </TouchableOpacity>
                    </View>
                    <View style={{ display: item.type == 'Room' ? 'flex' : 'none' }}>
                        <TouchableOpacity onPress={() => this.ScreenHor()}>
                            <Image style={styles.img} source={{ uri: item.image }} />
                            <SafeAreaView style={styles.description}>
                                <Text style={{ padding: 10 }}>
                                    {item.title} : {item.desc}   ...กดเพื่อดูรายละเอียดเพิ่มเติม
                                </Text>
                            </SafeAreaView>
                        </TouchableOpacity>
                    </View>

                    <View style={{ display: item.type == 'General' ? 'flex' : 'none' }}>
                        <TouchableOpacity onPress={() => this.ScreenGeneralTopic(item.id)} >
                            <Image style={styles.img} source={{ uri: item.image }} />
                            <SafeAreaView style={styles.description}>
                                <Text style={{ padding: 10 }}>
                                    {item.title} : {item.desc}   ...กดเพื่อดูรายละเอียดเพิ่มเติม
                                </Text>
                            </SafeAreaView>
                        </TouchableOpacity>
                    </View>
                </View>
            ))}
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
    description: {
        backgroundColor: "white",
        width: "80%",
        height: "100%",
        alignSelf: "center",
        flex: 1,
        marginBottom: 30,
        elevation: 15,
        padding: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: "pink",
        borderTopWidth: 10,
    }
});