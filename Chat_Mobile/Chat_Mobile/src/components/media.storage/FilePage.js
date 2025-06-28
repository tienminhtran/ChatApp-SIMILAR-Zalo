import React, { useMemo, useState } from "react";

import { View, Text, StyleSheet, StatusBar, FlatList, Dimensions, Image, TouchableOpacity, Modal } from "react-native";
import { useSelector } from "react-redux";
import { Video } from "expo-av";
import VideoMessage from "./VideoMessage";
import ImageMessage from "./ImageMessage";
import { getFileIcon } from "../../utils/FormatIconFile";
import { Linking } from "react-native";
import IconF5 from "react-native-vector-icons/FontAwesome5";


const {width, height} = Dimensions.get("window");
const FilePage = () => {
    const { user } = useSelector((state) => state.user);
    const { messages } = useSelector((state) => state.message);
    const messagesFiles = useMemo(() => {
        if(Array.isArray(messages)) {
            return messages.filter((message) => message?.messageType === "FILE"&& message?.recalled !== true);
        }
        return [];
    }, [messages]);

    console.log("messagesFiles size", messagesFiles.length);

    const openFile = async (url) => {
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert("Lỗi", "Không thể mở file");
            }
        } catch (error) {
            Alert.alert("Lỗi", "Không thể mở file: " + error.message);
        }
    };    

    return (
        <View style={styles.container}>
            <FlatList
                data={messagesFiles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={{flexDirection: 'row', marginBottom:2, padding: 10,alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#F4F5F6"}}
                        onPress={() => openFile(item?.fileUrl)}
                    >
                            <IconF5 name={getFileIcon(item?.content).icon} size={30} color={getFileIcon(item?.content).color} 
                                style={{
                                    marginRight: 5,
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                }} 
                            />
                            <View style={{ }}>
                                <Text style={{fontSize: width * 0.04,paddingRight: 10}}>{item?.content}</Text>
                                <Text style={{fontSize: width * 0.03, color: "blue", paddingRight: 10, paddingVertical:2}}>Tải về để xem lâu dài</Text>
                            </View>

                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.text}>Không có file nào</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        backgroundColor: "white",

    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default FilePage;
