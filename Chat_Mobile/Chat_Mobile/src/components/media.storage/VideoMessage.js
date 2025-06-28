import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Modal, Text, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { CLOUDINARY_VIDEO_THUMBNAIL_URL } from "@env";
import { extractPublicIdFromUrl } from '../../utils/PublicIdFromUrl';

const { width, height } = Dimensions.get('window');
const VideoMessage = ({ message }) => {
    const [showVideo, setShowVideo] = useState(false);

    const videoUrl = message?.fileUrl;
    const thumbnailUrl = CLOUDINARY_VIDEO_THUMBNAIL_URL + `${extractPublicIdFromUrl(videoUrl)}.jpg`;

    return (
        <View key={message?.id} style={styles.container}>
            {!showVideo ? (
                <TouchableOpacity onPress={() => setShowVideo(true)}>
                    <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
                    <View style={styles.playButton}>
                        <Text style={styles.playText}>▶</Text>
                    </View>
                </TouchableOpacity>                
            ): (
                <Modal visible={showVideo} animationType="slide">
                    <TouchableOpacity onPress={() => setShowVideo(false)} style={styles.closeBtn}>
                        <Text style={styles.closeText}>Đóng</Text>
                    </TouchableOpacity> 
                    <Video
                        key={message?.id}
                        source={{ uri: videoUrl }}
                        style={styles.video}
                        useNativeControls
                        resizeMode="cover"
                        shouldPlay
                    />
                </Modal>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: { width: width / 3 - 1, height: width / 3 - 1 },
    thumbnail: { width: width / 3 - 1, height: width / 3 - 1, backgroundColor: 'gray' },
    playButton: {
        position: 'absolute',
        top: '30%',
        left: '30%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 30,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    playText: { color: 'white', fontSize: 24, textAlign: 'center' },
    video: { flex: 1, width: '100%', height: '100%' },
    closeBtn: {width: width*0.15 ,backgroundColor: 'black', padding: 10, borderRadius: 5, margin: 10, alignSelf: 'flex-end'},
    closeText: { color: 'white', textAlign: 'center', fontSize: 16 },
})

export default VideoMessage;