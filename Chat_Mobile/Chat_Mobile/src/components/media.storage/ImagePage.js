import React, { useMemo, useState } from "react";

import { View, Text, StyleSheet, StatusBar, FlatList, Dimensions, Image, TouchableOpacity, Modal } from "react-native";
import { useSelector } from "react-redux";
import { Video } from "expo-av";
import VideoMessage from "./VideoMessage";
import ImageMessage from "./ImageMessage";

const {width, height} = Dimensions.get("window");
const ImagePage = () => {
    const { user } = useSelector((state) => state.user);
    const { messages } = useSelector((state) => state.message);
    const messagesImages = useMemo(() => {
        if(Array.isArray(messages)) {
            return messages.filter((message) => (message?.messageType === "IMAGE" || message?.messageType === "VIDEO") && message?.recalled !== true);
        }
        return [];
    }, [messages]);


    console.log("messagesImages", messagesImages);

    return (
        <View style={styles.container}>
            <FlatList
                data={messagesImages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{marginRight: 2, marginBottom:2, alignItems: "center"}}>
                        {item?.messageType === "IMAGE" ? (
                            <ImageMessage message={item} />
                        ) : (
                            <VideoMessage message={item} />
                        )}
                    </View>
                )}
                numColumns={3}
                ListEmptyComponent={() => (
                    <Text style={styles.text}>Không có ảnh hoặc video nào</Text>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width
    },
    text: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default ImagePage;
