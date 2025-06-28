import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createVote } from '../../api/vote';

const CreateVoteScreen = ({ navigation, route }) => {
  const { members, user, conversationId } = route.params || {};

  const [title, setTitle] = useState('');
  const [options, setOptions] = useState(['Phương án 1', 'Phương án 2']);
  const [allowMultiple, setAllowMultiple] = useState(true);
  const [canAddOption, setCanAddOption] = useState(true);
  const [hideResultsBeforeVote, setHideResultsBeforeVote] = useState(false);
  const [useTimeLimit, setUseTimeLimit] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);

  const [endDate, setEndDate] = useState(new Date());
  const [showEndPicker, setShowEndPicker] = useState(false);

  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      if (selectedDate < startDate) {
        Alert.alert('Lỗi', 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
        return;
      }
      setEndDate(selectedDate);
    }
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const updateOption = (text, index) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const formatDateTime = (date) => date.toLocaleString();

  // Tạo object vote để gửi backend
  const buildVoteObject = () => ({
    groupId: conversationId,
    userIdCreator: user?.id,
    userIdMembers: members?.map((m) => m.id) || [],
    title,
    questions: options
      .filter((opt) => opt.trim() !== '')
      .map((content) => ({ content, userIds: [] })),
    setTime: useTimeLimit,
    createdAt: new Date().toISOString(),
    endAt: useTimeLimit ? endDate.toISOString() : null,
    isResult: hideResultsBeforeVote,
    isMultipleChoice: allowMultiple,
  });

const submitVote = async () => {
  if (!title.trim()) {
    Alert.alert('Lỗi', 'Bạn cần nhập tiêu đề bình chọn');
    return;
  }
  if (options.length < 2) {
    Alert.alert('Lỗi', 'Phải có ít nhất 2 phương án bình chọn');
    return;
  }
  try {
    const voteObj = buildVoteObject();
    const createdVote = await createVote(voteObj);
    Alert.alert('Thành công', 'Tạo bình chọn thành công!');

    // Chuyển sang màn hình hiển thị Poll và truyền vote vừa tạo
    navigation.navigate('GroupChatScreen', { vote: createdVote });

  } catch (error) {
    Alert.alert('Lỗi', error.toString());
  }
};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tiêu đề bình chọn</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tiêu đề bình chọn"
        value={title}
        onChangeText={setTitle}
        autoFocus
      />

      <Text style={styles.title}>Đặt câu hỏi bình chọn</Text>
      {options.map((option, index) => (
        <View key={index} style={styles.optionRow}>
          <TextInput
            style={styles.input}
            value={option}
            onChangeText={(text) => updateOption(text, index)}
            placeholder={`Phương án ${index + 1}`}
          />
          <TouchableOpacity onPress={() => removeOption(index)}>
            <Text style={styles.remove}>✕</Text>
          </TouchableOpacity>
        </View>
      ))}

      {canAddOption && (
        <TouchableOpacity onPress={addOption}>
          <Text style={styles.addOption}>+ Thêm phương án</Text>
        </TouchableOpacity>
      )}

      <View style={styles.option}>
        <Text>Sử dụng thời gian bình chọn</Text>
        <Switch value={useTimeLimit} onValueChange={setUseTimeLimit} />
      </View>

      {useTimeLimit && (
        <>
          <Text style={styles.title}>Thời gian bình chọn</Text>
          <TouchableOpacity
            style={styles.datetimeButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text>Bắt đầu: {formatDateTime(startDate)}</Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={startDate}
              mode="datetime"
              display="default"
              onChange={onStartDateChange}
              minimumDate={new Date()}
            />
          )}

          <TouchableOpacity
            style={styles.datetimeButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text>Kết thúc: {formatDateTime(endDate)}</Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={endDate}
              mode="datetime"
              display="default"
              onChange={onEndDateChange}
              minimumDate={startDate}
            />
          )}
        </>
      )}

      <Text style={styles.subtitle}>Tuỳ chọn</Text>

      <View style={styles.option}>
        <Text>Ẩn kết quả khi chưa bình chọn</Text>
        <Switch value={hideResultsBeforeVote} onValueChange={setHideResultsBeforeVote} />
      </View>

      <View style={styles.option}>
        <Text>Chọn nhiều phương án</Text>
        <Switch value={allowMultiple} onValueChange={setAllowMultiple} />
      </View>

      <View style={styles.option}>
        <Text>Có thể thêm phương án</Text>
        <Switch value={canAddOption} onValueChange={setCanAddOption} />
      </View>

      <TouchableOpacity
        style={[styles.datetimeButton, { backgroundColor: '#007bff', marginTop: 20 }]}
        onPress={submitVote}
      >
        <Text style={{ color: '#fff', textAlign: 'center' }}>Tạo bình chọn</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
  subtitle: { marginTop: 20, fontWeight: 'bold', fontSize: 16 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 8,
  },
  remove: {
    marginLeft: 8,
    color: 'red',
    fontSize: 18,
  },
  addOption: {
    color: '#007bff',
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    alignItems: 'center',
  },
  datetimeButton: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
  },
});

export default CreateVoteScreen;
