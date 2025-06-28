import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    ScrollView,
    Switch,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Dimensions
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";


const { width, height } = Dimensions.get("window");
const DetailSingleChatScreen = ({navigation, route}) => {
    const {userReceived} = route.params;
    console.log("User received: ", userReceived);
    const [isBestFriend, setIsBestFriend] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isCallAlert, setIsCallAlert] = useState(true);

    return (
        <ScrollView style={styles.container}>

            {/* Header */}
            <View
                style={{
                    width: width,
                    height: height * 0.06,
                    backgroundColor: "#2196F3",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: width * 0.04,
                    gap: 20
                }}
            >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={width * 0.07} color="white" />
                </TouchableOpacity>
                <Text
                    style={{
                        color: "white",
                        fontSize: width * 0.05,
                        fontWeight: "bold",
                    }}
                >
                   Tùy chọn
                </Text>                
            </View>           

            {/* Ảnh đại diện + Tên */}
            <View style={styles.profileHeader}>
                <Image
                    source={{
                        uri: userReceived?.avatar || "https://avatars.githubusercontent.com/u/100653357?v=4",
                    }}
                    style={styles.avatar}
                />
                <Text style={styles.name}>{userReceived?.display_name}</Text>
            </View>

            {/* Các tùy chọn chính */}
            <View style={styles.optionsRow}>
                <OptionButton icon="search" text="Tìm tin nhắn"  />
                <OptionButton icon="user" text="Trang cá nhân" navigation={() => navigation.navigate('Profile', {userReceived})}/>
                <OptionButton icon="image" text="Đổi hình nền" />
                <OptionButton icon="bell-off" text="Tắt thông báo" />
            </View>

            {/* Đánh dấu bạn thân */}
            {/* <SettingToggle
                label="Đánh dấu bạn thân"
                value={isBestFriend}
                onChange={setIsBestFriend}
                
            /> */}

            {/* Ảnh, file, link */}
            {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Ảnh, file, link</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {[1, 2, 3, 4].map((item, index) => (
                        <Image
                            key={index}
                            source={{ uri: "https://i.imgur.com/6Z9PaeV.png" }}
                            style={styles.fileImage}
                        />
                    ))}
                </ScrollView>
            </View> */}
            
            <TouchableOpacity style={styles.optionRow}  onPress={() => navigation.navigate("TabTopMedia")}>
                <Ionicons name="folder" size={20} color="#8F9499" />
                <Text style={styles.optionText}>Ảnh, file, link</Text>
            </TouchableOpacity>

            {/* Tạo nhóm & Thêm vào nhóm */}
            <TouchableOpacity style={styles.optionRow}>
                <Ionicons name="people-outline" size={20} color="#8F9499" />
                <Text style={styles.optionText}>Tạo nhóm với Dương</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow}>
                <Ionicons name="person-add-outline" size={20} color="#8F9499" />
                <Text style={styles.optionText}>Thêm Dương vào nhóm</Text>
            </TouchableOpacity>

            {/* Nhóm */}
            <TouchableOpacity style={styles.optionRow}>
                <Ionicons name="people-outline" size={20} color="#8F9499" />
                <Text style={styles.optionText}>Xem nhóm chung ()</Text>
            </TouchableOpacity>

            {/* Ghim và ẩn trò chuyện */}
            {/* <SettingToggle
                label="Ghim trò chuyện"
                value={isPinned}
                onChange={setIsPinned}
            />
            <SettingToggle
                label="Ẩn trò chuyện"
                value={isMuted}
                onChange={setIsMuted}
            />
            <SettingToggle
                label="Báo cuộc gọi đến"
                value={isCallAlert}
                onChange={setIsCallAlert}
            /> */}

            {/* Cài đặt khác */}
            <TouchableOpacity style={styles.optionRow}>
                <Feather name="settings" size={20} color="#8F9499" />
                <Text style={styles.optionText}>Cài đặt cá nhân</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionRow}>
                <Feather name="trash" size={20} color="red" />
                <Text style={[styles.optionText, { color: "red" }]}>
                    Xóa lịch sử trò chuyện
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

// Component hiển thị tùy chọn
const OptionButton = ({ icon, text, navigation }) => (
    <TouchableOpacity style={styles.optionButton} onPress={navigation}>
        <Feather name={icon} size={22} color="black" />
        <Text style={styles.optionText}>{text}</Text>
    </TouchableOpacity>
);

// Component toggle bật/tắt
const SettingToggle = ({ label, value, onChange }) => (
    <View style={styles.optionRow}>
        <Text style={styles.optionText}>{label}</Text>
        <Switch value={value} onValueChange={onChange} />
    </View>
);

// 🌟 Style CSS
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffff",
        paddingTop: StatusBar.currentHeight + 10,
    },
    profileHeader: {
        alignItems: "center",
        marginVertical: 20,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    name: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
    },
    status: {
        color: "gray",
        fontSize: 14,
    },
    optionsRow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        // paddingRight: 10,
    },
    optionButton: {
        alignItems: "center",
        padding: 10,
    },
    optionText: {
        color: "#000",
        fontSize: 14,
        marginTop: 5,
    },
    section: {
        margin: 15,

    },
    sectionTitle: {
        color: "#000",
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10,
    },
    fileImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
    optionRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F4F5F6",
        padding: 15,
        borderRadius: 10,
        marginVertical: 5,
        marginHorizontal: 15,
        gap: 10,
    },
    optionIcon: {
        marginRight: 10,
    },
});

export default DetailSingleChatScreen;
