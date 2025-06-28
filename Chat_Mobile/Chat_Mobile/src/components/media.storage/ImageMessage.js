import React, { useState } from 'react';
import { View, Dimensions, Image, TouchableOpacity, Modal, StyleSheet, Text } from 'react-native';

const { width, height } = Dimensions.get('window');
const ImageMessage = ({ message }) => {
    const [showImage, setShowImage] = useState(false);

    return (
        <View key={message?.id} style={styles.container}>
            {!showImage ? (
                <TouchableOpacity onPress={() => setShowImage(true)}>
                    <Image source={{ uri: message?.fileUrl }} style={styles.image} />                
                </TouchableOpacity>                
            ): (
                <Modal visible={showImage} animationType="slide" transparent={true}>
                    <View style={styles.modalContainer}>

                        <TouchableOpacity onPress={() => setShowImage(false)} style={styles.closeBtn}>
                            <Text style={styles.closeText}>Đóng</Text>
                        </TouchableOpacity> 
                        <Image source={{ uri: message?.fileUrl }} style={styles.fullImage} resizeMode="contain" />
                    </View>

                </Modal>
            )}

        </View>
    )
}

const styles = StyleSheet.create({
    container: { width: width / 3 - 4, height: width / 3 - 4 },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgb(0, 0, 0)',
    },
    image: { width: width / 3 - 4, height: width / 3 - 4, backgroundColor: 'gray' },
    fullImage: {
        width: '100%',
        height: '70%',
    },
    closeBtn: {width: width*0.15 ,backgroundColor: 'white', padding: 10, borderRadius: 5, margin: 10, alignSelf: 'flex-end'},
    closeText: { color: 'black', textAlign: 'center', fontSize: 16 },
})

export default ImageMessage;