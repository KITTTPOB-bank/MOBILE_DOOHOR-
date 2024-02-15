import React from 'react';
import { View, StyleSheet, TouchableOpacity, Button } from 'react-native';

const Button_Row = React.memo((props) => {
    const { initialVal, handleOnRowSelect, info } = props;
    return (
        <TouchableOpacity style={styles.touchableOpacity}>
            <View style={styles.container}>
                <Button style={styles.byn} title="Select" onPress={handleOnRowSelect?.bind(null, !initialVal, info.id, info.name)} ></Button>
            </View>
        </TouchableOpacity>
    );
})

export default Button_Row;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 50,
        alignItems: 'center',

    },
    btn: { width: "100%", height: 50, backgroundColor: '#78B7BB', borderRadius: 2 },
})