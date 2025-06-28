import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/FontAwesome';

const AccountSecurityScreen = ({ navigation }) => {

    const handleChangePassword = () => {
        navigation.navigate('ChangePasswordScreen');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity style={styles.option} onPress={handleChangePassword}>
                    <Icon name="lock" size={20} color="#007AFF" style={styles.icon} />
                    <Text style={styles.optionText}>Thay đổi mật khẩu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.option}>
                    <Icon name="trash" size={20} color="#FF3B30" style={styles.icon} />
                    <Text style={styles.optionText}>Xóa tài khoản</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    content: {
        marginTop: 20,
        backgroundColor: '#fff',
        paddingVertical: 10,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    icon: {
        marginRight: 15,
    },
    optionText: {
        fontSize: 16,
        color: '#121212',
    },
});

export default AccountSecurityScreen;
