import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { addVoteQuestion } from '../../api/vote';

const QuestionModalDetail = ({
  visible,
  onClose,
  voteId,
  title,
  options,
  userMap,
  loadingAddOption,
  setLoadingAddOption,  // truyền từ ngoài để set loading khi gọi api
  onQuestionAdded, // callback sau khi thêm thành công, để reload dữ liệu ngoài
}) => {
  const [newOptionText, setNewOptionText] = useState('');

  const handleAddOption = async () => {
    if (!newOptionText.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung phương án mới');
      return;
    }

    try {
      setLoadingAddOption(true);
      const res = await addVoteQuestion({
        voteId,
        questionContent: newOptionText.trim(),
      });
      Alert.alert('Thành công', 'Đã thêm câu hỏi mới');
      setNewOptionText('');
      onQuestionAdded && onQuestionAdded(res);
    } catch (error) {
      console.error('Lỗi thêm câu hỏi:', error);
      Alert.alert('Lỗi', 'Không thể thêm câu hỏi mới');
    } finally {
      setLoadingAddOption(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.voteId}>Mã bình chọn: {voteId}</Text>

          {/* Options list */}
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {options.map((option, idx) => (
              <View key={idx} style={styles.optionContainer}>
                <Text style={styles.optionText}>{option.content || option}</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.avatarScroll}
                >
                  {(option.userIds || []).map(uid => {
                    const user = userMap[uid];
                    if (!user || !user.avatar) return null;
                    return (
                      <Image
                        key={uid}
                        source={{ uri: user.avatar }}
                        style={styles.avatar}
                      />
                    );
                  })}
                </ScrollView>
              </View>
            ))}
          </ScrollView>

          {/* Form thêm phương án mới */}
          <View style={styles.addOptionForm}>
            <TextInput
              style={styles.input}
              placeholder="Nhập phương án mới"
              value={newOptionText}
              onChangeText={setNewOptionText}
              editable={!loadingAddOption}
            />
            <TouchableOpacity
              style={[styles.addOptionBtn, loadingAddOption && { opacity: 0.6 }]}
              onPress={handleAddOption}
              disabled={loadingAddOption}
            >
              <Text style={styles.addOptionBtnText}>
                {loadingAddOption ? 'ĐANG THÊM...' : 'THÊM BÌNH CHỌN'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeIcon: {
    padding: 6,
  },
  closeText: {
    fontSize: 24,
    color: '#888',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007bff',
    flex: 1,
  },
  voteId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  scrollView: {
    marginBottom: 12,
  },
  optionContainer: {
    marginBottom: 16,
    backgroundColor: '#f2f6ff',
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  avatarScroll: {
    flexDirection: 'row',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  addOptionForm: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 10,
    fontWeight: '600',
    fontSize: 14,
  },
  addOptionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
        backgroundColor: '#dbeeff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  addOptionBtnText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default QuestionModalDetail;
