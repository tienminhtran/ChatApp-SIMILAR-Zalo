import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

const EditStatusScreen = ({ navigation }) => {
    const [status, setStatus] = useState("Đường còn dài, tuổi còn trẻ");

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                value={status}
                onChangeText={setStatus}
            />
            <Button title="Lưu" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    input: {
        width: "80%",
        height: 40,
        borderBottomWidth: 1,
        borderColor: "#ccc",
        fontSize: 18,
        marginBottom: 20,
    },
});

export default EditStatusScreen;
