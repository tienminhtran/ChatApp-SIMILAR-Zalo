import React, { useState } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

const CallScreen = ({navigation}) => {
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [isSpeakerOn, setIsSpeakerOn] = useState(false);

    return (
        <ImageBackground
            source={{ uri: 'https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/482741PIj/anh-mo-ta.png' }} // Ảnh nền/video của người gọi
            style={styles.container}
            blurRadius={isCameraOn ? 0 : 10} // Làm mờ nếu camera tắt
        >
            {/* Tên người gọi và thời gian */}
            <View style={styles.infoContainer}>
                <Text style={styles.callerName}>Ngô Văn Toàn</Text>
                <Text style={styles.callStatus}>Đang gọi video...</Text>
            </View>

            {/* Nút điều khiển */}
            <View style={styles.controls}>
                <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.controlButton}>
                    <Icon name={isMuted ? "microphone-slash" : "microphone"} size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsCameraOn(!isCameraOn)} style={styles.controlButton}>
                    <FontAwesome5 name={isCameraOn ? "video" : "video-slash"} size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setIsSpeakerOn(!isSpeakerOn)} style={styles.controlButton}>
                    <Icon name={isSpeakerOn ? "volume-up" : "volume-off"} size={24} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.endCallButton}>
                    <Icon name="phone" size={24} color="#fff" />
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#000',
    },

    infoContainer: {
        marginTop: 80,
        alignItems: 'center',
    },

    callerName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },

    callStatus: {
        fontSize: 14,
        color: '#ddd',
        marginTop: 5,
    },

    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
        paddingVertical: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },

    controlButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
    },

    endCallButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CallScreen;
