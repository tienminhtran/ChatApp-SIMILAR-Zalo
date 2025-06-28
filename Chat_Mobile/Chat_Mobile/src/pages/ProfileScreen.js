import React, { useState, useMemo } from "react";
import { View, Text, Image, ActivityIndicator,TouchableOpacity, StyleSheet, ScrollView, Modal, StatusBar, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import {updateUserProfile, updateUserProfileSuccess } from "../store/slice/userSlice";
import { checkFriendStatus } from "../store/slice/friendSlice";
import * as ImagePicker from "expo-image-picker";
import Loading from "../components/Loading";

import { connectWebSocket, disconnectWebSocket, subscribeToUserProfile } from "../config/socket";

const ProfileScreen = ({ navigation, route }) => {
    const { userReceived } = route.params || {};
    
    // const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    // Thêm state mới ở phần đầu component
    const [personalInfoModalVisible, setPersonalInfoModalVisible] = useState(false);
    const [editInfoModalVisible, setEditInfoModalVisible] = useState(false);

    const dispatch = useDispatch();
    const userProfile = useSelector(state => state.user.user);
    const isLoading = useSelector(state => state.user.isLoading);

    const { friendStatus } = useSelector(state => state.friend); // Lấy trạng thái bạn bè từ Redux
    console.log("Friend status:", friendStatus); // Kiểm tra trạng thái bạn bè

    const user = useMemo(() => userReceived || userProfile, [userReceived, userProfile]); // Lấy thông tin người dùng từ props hoặc Redux

    const [fullName, setFullName] = useState(user?.display_name || "");
    const [gender, setGender] = useState(user?.gender || "");

    const [dobDate, setDobDate] = useState(user?.dob ? new Date(user.dob) : new Date()); // Ngày sinh mặc định là ngày hiện tại
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [avatarUpdate, setAvatarUpdate] = useState(null); // Avatar mặc định là null

    const [avatarUrl, setAvatarUrl] = useState( user?.avatar ||'');

    
    React.useEffect(() => {
        if(!user?.id) return;

        dispatch(checkFriendStatus(user?.id));
    }, [user?.id, dispatch]);


    React.useEffect(() => {
        if(!user?.id) return;
        
        // function để xử lý khi nhận được tin nhắn từ WebSocket
        const handleMessageReceived = (updatedProfile) => {
            console.log("Message received:", updatedProfile);
            
            // Xử lý thông điệp nhận được từ WebSocket
            dispatch(updateUserProfileSuccess(updatedProfile));
        };

        connectWebSocket(() => {
            subscribeToUserProfile(user.id, handleMessageReceived);
        });

            
        return () => {
            disconnectWebSocket(); // Ngắt kết nối khi component unmount
        }
    },[user?.id, dispatch]);

    // Format lại ngày sinh:
    const formatDate = (date) => {
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // Chọn ảnh từ thư viện
            allowsEditing: true, // Cho phép chỉnh sửa ảnh
            aspect: [1, 1], // Tỉ lệ ảnh
            quality: 1, 
        })

        if(!result.canceled) {
            const image = result.assets[0];
            setAvatarUpdate({
                uri: image.uri,
                name: image.fileName || "avatar.jpg",
                type: "image/jpeg",
            });
            setModalVisible(false);

        }
    }

    const pickImageImageSingle= async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
        if (!result.canceled) {
            const image = result.assets[0];
            const imageData = {
                uri: image.uri,
                name: image.fileName || "avatar.jpg",
                type: "image/jpeg",
            };
    
            setAvatarUpdate(imageData); // lưu avatar
            console.log("Avatar update:", imageData);
            handleSaveImageSingle(imageData); // gọi lưu
        }
    };
    

    const handleSaveImageSingle = async (imageData) => {
        const formattedDob = dobDate.toISOString().split("T")[0];
        const request = {
            display_name: fullName,
            gender: gender,
            dob: formattedDob,
        };
    
        const formData = new FormData();
        formData.append("request", JSON.stringify(request), "application/json");
    
        if (imageData) {
            formData.append("avatar", imageData);
            console.log("Avatar update:", imageData);
        }

        try {
            await dispatch(updateUserProfile(formData)).unwrap();
            console.log("Cập nhật thành công:", user.avatar);
            Alert.alert("Cập nhật thành công", "Thông tin cá nhân đã được cập nhật.");
        } catch (error) {
            console.log("Update error:", error);
            Alert.alert("Cập nhật thất bại", "Vui lòng thử lại sau.");
        }
    };
    

    const handleSave = async () => {
        const formattedDob = dobDate.toISOString().split("T")[0]; // Chuyển đổi ngày sinh thành định dạng YYYY-MM-DD
        console.log("Formatted Date:", formattedDob);
        // Gửi fullName, formattedDob, gender lên server hoặc Redux
        const request = {
            display_name: fullName,
            gender: gender,
            dob: formattedDob,
        }
        console.log("Request:", request);

        const formData = new FormData();
        formData.append("request", JSON.stringify(request), "application/json");

        //image
        if(avatarUpdate) { 
            formData.append("avatar", avatarUpdate);
        }

        try {

            await dispatch(updateUserProfile(formData)).unwrap(); // unwrap để lấy giá trị trả về từ thunk fulfilled khi thành công hoặc thất bại
           
                setEditInfoModalVisible(false);
                Alert.alert("Cập nhật thành công", "Thông tin cá nhân đã được cập nhật.");
            
        } catch (error) {
            console.log("Update error:", error);
            Alert.alert("Cập nhật thất bại", "Vui lòng thử lại sau.");
        }
    };

    const handleAvatarViolationCheck = () => {
        // Giả sử bạn đã có một biến avatarUrl lưu trữ URL ảnh đại diện
       
            Alert.alert("Cảnh báo", "Ảnh đại diện của bạn đã vi phạm quy tắc cộng đồng (lừa đảo, công kích, nhại cảm...)");
        
    };




    return (
        <ScrollView style={styles.container}>

            <View style={styles.iconContainer}>
                {/* Nút mũi tên quay lại */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate("ProfileMain"); // Chuyển đến màn hình chính nếu không có màn hình trước đó
                        }
                    }}
                >
                    <Ionicons name="arrow-back-outline" size={24} color="white" />
                </TouchableOpacity>
                {/* Nút time-outline */}
                <TouchableOpacity
                    style={styles.historyButton}
                    onPress={() => setHistoryModalVisible(true)}
                >
                    <Ionicons name="time-outline" size={24} color="white" />
                </TouchableOpacity>

                {/* Nút 3 chấm */}
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="ellipsis-horizontal-outline" size={24} color="white" />
                </TouchableOpacity>
            </View>

            {/* Modal hiện lịch sử */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={historyModalVisible}
                onRequestClose={() => setHistoryModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Cho phép bạn bè xem nhật ký</Text>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Toàn bộ bài đăng</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Trong 7 ngày gần nhất</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Trong 1 tháng gần nhất</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Trong 6 tháng gần nhất</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Tùy chỉnh</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setHistoryModalVisible(false)}
                        >
                            <Text>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal hiện menu */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            style={styles.modalItem}
                            onPress={() => {
                                setModalVisible(false);
                                setPersonalInfoModalVisible(true); // mở modal thông tin cá nhân
                            }}
                        >
                            <Text>Thông tin cá nhân</Text>
                        </TouchableOpacity>


                        <TouchableOpacity style={styles.modalItem} onPress={pickImageImageSingle}>
                            <Text>Đổi ảnh đại diện</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity style={styles.modalItem}>
                            <Text>Đổi ảnh bìa</Text>
                        </TouchableOpacity> */}

                        <TouchableOpacity style={styles.modalItem}>
                            <Text>Cập nhật giới thiệu bản thân</Text>
                        </TouchableOpacity>

                        {/* <TouchableOpacity style={styles.modalItem}>
                            <Text>Ví của tôi</Text>
                        </TouchableOpacity> */}

                        {/* Đóng modal */}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal thông tin cá nhân */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={personalInfoModalVisible}
                onRequestClose={() => setPersonalInfoModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={[styles.modalContent, { width: '90%', padding: 0, }]}>
                        {/* Ảnh bìa và avatar */}
                        <View style={{ position: 'relative', alignItems: 'center' }}>
                            {/* Ảnh bìa */}
                            <Image
                                source={{ uri: 'https://statictuoitre.mediacdn.vn/thumb_w/730/2017/1-1512755474911.jpg' }}
                                style={{ width: '100%', height: 120, borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
                                resizeMode="cover"
                            />
                            {/* Ảnh đại diện */}
                            <Image
                                source={{ uri: user?.avatar ||'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482741PIj/anh-mo-ta.png' }}
                                style={{
                                    width: 100,
                                    height: 100,
                                    borderRadius: 50,
                                    borderWidth: 3,
                                    borderColor: 'white',
                                    position: 'absolute',
                                    bottom: -50
                                }}
                            />
                        </View>

                        {/* Thông tin bên dưới avatar */}
                        <View style={{ alignItems: 'center', marginTop: 60 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#000' }}>
                                {user?.display_name}
                            </Text>
                        </View>

                        {/* Thông tin chi tiết */}
                        <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Giới tính</Text>
                                <Text style={styles.infoValue}>{user?.gender === "MALE" ? "Nam" : "Nữ"}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Ngày sinh</Text>
                                <Text style={styles.infoValue}>{user?.dob}</Text>
                            </View>

                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Điện thoại</Text>
                                <Text style={styles.infoValue}>{user?.phone}</Text>
                            </View>

                            <Text style={{ color: "#666", fontSize: 12, marginTop: 5 }}>
                                Số điện thoại chỉ hiển thị với người có lưu số bạn trong danh bạ máy
                            </Text>

                            <TouchableOpacity
                                style={[styles.button, { marginTop: 20, alignSelf: "center", display: user?.id === userProfile?.id ? "flex" : "none", }]}
                                onPress={() => {
                                    setPersonalInfoModalVisible(false);
                                    setEditInfoModalVisible(true);
                                }}
                                disabled={user?.id !== userProfile?.id} // Disable button if not the same user
                                aria-hidden={user?.id !== userProfile?.id}
                            >
                                <Text style={styles.buttonText}>Chỉnh sửa</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>



            {/* Modal chỉnh sửa thông tin cá nhân */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={editInfoModalVisible}
                onRequestClose={() => setEditInfoModalVisible(false)}
            >
                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    {/* Header */}
                    <View style={{ flexDirection: "row", alignItems: "center", padding: 16 }}>
                        <TouchableOpacity onPress={() => setEditInfoModalVisible(false)}>
                            <Ionicons name="arrow-back-outline" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={{ color: "black", fontSize: 20, marginLeft: 16 }}>Chỉnh sửa thông tin</Text>
                    </View>

                    {/* Avatar */}
                    <View style={{ alignItems: "center", marginTop: 20 }}>
                        {avatarUpdate ? (
                            <Image source={{uri: avatarUpdate.uri}}
                                style={{ width: 100, height: 100, borderRadius: 50 }}
                            />
                        ) : (

                            <Image
                                source={{
                                    uri: user?.avatar || "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482741PIj/anh-mo-ta.png"
                                }}
                                style={{ width: 100, height: 100, borderRadius: 50 }}
                            />
                        )}
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#eee",
                                borderRadius: 20,
                                padding: 5,
                                position: "absolute",
                                top: 80,
                                right: 120
                            }}
                            onPress={pickImage}
                        >
                            <Ionicons name="camera-outline" size={18} color="black" />
                        </TouchableOpacity>
                    </View>

                    {/* Form */}
                    <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
                        {/* Họ tên */}
                        <Text style={{ color: "black", marginBottom: 5 }}>Họ tên</Text>
                        <TextInput
                            style={{
                                backgroundColor: "#f0f0f0",
                                borderRadius: 5,
                                padding: 10,
                                marginBottom: 10,
                                color: "black"
                            }}
                            value={fullName}
                            onChangeText={setFullName}
                        />

                        {/* Ngày sinh */}
                        {/* Ngày sinh */}
                        <Text style={{ color: "black", marginBottom: 5 }}>Ngày sinh</Text>
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#f0f0f0",
                                borderRadius: 5,
                                padding: 10,
                                marginBottom: 10
                            }}
                            onPress={() => setShowDatePicker(true)}
                        >
                            <Text style={{ color: "black" }}>{formatDate(dobDate)}</Text>
                        </TouchableOpacity>

                        {showDatePicker && (
                            <DateTimePicker
                                value={dobDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={(event, selectedDate) => {
                                    const currentDate = selectedDate || dobDate;
                                    setShowDatePicker(Platform.OS === 'ios');
                                    setDobDate(currentDate);
                                }}
                            />
                        )}

                        {/* Giới tính */}
                        <Text style={{ color: "black", marginBottom: 5 }}>Giới tính</Text>
                        <View style={{ flexDirection: "row", marginBottom: 20 }}>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center", marginRight: 20 }}
                                onPress={() => setGender("MALE")}
                            >
                                <Ionicons
                                    name={gender === "MALE" ? "checkmark-circle" : "ellipse-outline"}
                                    size={20}
                                    color="#007AFF"
                                />
                                <Text style={{ color: "black", marginLeft: 5 }}>Nam</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ flexDirection: "row", alignItems: "center" }}
                                onPress={() => setGender("FEMALE")}
                            >
                                <Ionicons
                                    name={gender === "FEMALE" ? "checkmark-circle" : "ellipse-outline"}
                                    size={20}
                                    color="#007AFF"
                                />
                                <Text style={{ color: "black", marginLeft: 5 }}>Nữ</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Nút lưu */}
                        <TouchableOpacity
                            style={{
                                backgroundColor: "#00A9FF",
                                borderRadius: 30,
                                padding: 15,
                                alignItems: "center"
                            }}
                            onPress={handleSave}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>LƯU</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Loading isLoading={isLoading} /> 
            </Modal>



            {/* Ảnh bìa */}
            <View style={styles.coverPhotoContainer}>
                <Image
                    source={{ uri: "https://statictuoitre.mediacdn.vn/thumb_w/730/2017/1-1512755474911.jpg" }}
                    style={styles.coverPhoto}
                />
            </View>

            {/* Ảnh đại diện và thông tin */}
            <View style={styles.profileInfo}>
                <Image
                    source={{ uri: user?.avatar || "https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482741PIj/anh-mo-ta.png" }}
                    style={styles.avatar}
                />
                    <TouchableOpacity
                        style={{
                            backgroundColor: "#eee",
                            borderRadius: 20,
                            padding: 5,
                            position: "absolute",
                            top: 80,
                            right: 140
                        }}
                        onPress={pickImageImageSingle}
                    >
                <Ionicons name="camera-outline" size={18} color="black"/>
                </TouchableOpacity>
                <Text style={styles.userName}>{user?.display_name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate("EditStatus")}>
                    <Text style={styles.status}>"Đường còn dài, tuổi còn trẻ"</Text>
                </TouchableOpacity>
            </View>

            {/* Kết bạn và nhắn tin */}
            {user?.id !== userProfile?.id && (
                <View style={styles.actions}>
                
                    <TouchableOpacity
                        style={[styles.button, { marginTop: 20, alignSelf: "center"}]}
                            onPress={() => {
                                
                            }}
                    >
                        <Text style={styles.buttonText}>Nhắn tin</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, { marginTop: 20, alignSelf: "center", display: !friendStatus ? "flex" : "none", }]}
                            onPress={() => {
                                
                            }}
                        disabled={user?.id !== userProfile?.id} // Disable button if not the same user
                        aria-hidden={user?.id !== userProfile?.id}
                    >
                        <Text style={styles.buttonText}>Kết bạn</Text>
                    </TouchableOpacity>

                </View>
            )}

            {/* Các mục khác */}
            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="images-outline" size={24} color="black" />
                    <Text style={styles.menuText}>Ảnh của tôi</Text>
                </TouchableOpacity>



<TouchableOpacity style={styles.menuItem} onPress={handleAvatarViolationCheck}>
    <Ionicons name="bookmark-outline" size={24} color="black" />
    <Text style={styles.menuText}>Kho khoảnh khắc</Text>
</TouchableOpacity>


            </View>
            <Loading isLoading={isLoading} />        

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    coverPhotoContainer: { height: 300, backgroundColor: "#ccc" },
    coverPhoto: { width: "100%", height: "100%" },
    profileInfo: { alignItems: "center", marginTop: -50 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: "#fff" },
    userName: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
    status: {
        fontSize: 18,
        color: "#000000",
        // textDecorationLine: "underline",
    },
    actions: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
    button: { flexDirection: "row", alignItems: "center", backgroundColor: "#007AFF", padding: 10, borderRadius: 5, marginHorizontal: 5 },
    buttonText: { color: "white", marginLeft: 5 },
    menu: { marginTop: 20 },
    menuItem: { flexDirection: "row", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#ddd" },
    menuText: { fontSize: 18, marginLeft: 10 },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15, // Tăng padding ngang để có khoảng cách đều hơn
        // paddingVertical: 10, // Thêm padding dọc để căn giữa
        top: 60
    },

    backButton: {
        position: "absolute",
        left: 10,  // Căn lề trái
        padding: 5,
        zIndex: 10, // Đảm bảo nút nằm trên cùng
    },
    historyButton: {
        position: "absolute",
        // top: 50,
        right: 50,
        zIndex: 10,
    },
    menuButton: {
        position: "absolute",
        // top: 45,  // Giảm xuống để không bị che khuất
        right: 10, // Đặt sát mép phải
        zIndex: 10, // Đảm bảo nằm trên cùng
        padding: 10,
        borderRadius: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    mmodalContent: {
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingBottom: 20,
        overflow: "hidden"
    }
    ,
    modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    closeButton: {
        marginTop: 10,
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 300,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    closeButton: {
        marginTop: 10,
        alignItems: "center",
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    infoLabel: {
        fontWeight: "bold",
        fontSize: 16,
    },
    infoValue: {
        fontSize: 16,
    },


});

export default ProfileScreen;
