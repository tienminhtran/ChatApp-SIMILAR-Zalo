import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { sendVoteOption, getVoteById } from '../../api/vote';
import { getUserById } from '../../api/userApi';
//pluscircleo
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  Entypo,
  AntDesign,
  FontAwesome
} from '@expo/vector-icons';

import QuestionModalDetail from './QuestionModalDetail'; // Assuming this is the correct path to your modal component

const Poll = ({ voteId, title, options, onVoteSuccess }) => {
  const dispatch = useDispatch();
  const userProfile = useSelector(state => state.user.user);
  const user = useMemo(() => userProfile || null, [userProfile]);

  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // modal them question
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingAddOption, setLoadingAddOption] = useState(false);
  const [localOptions, setLocalOptions] = useState(options);


    const handleQuestionAdded = (updatedVote) => {
    if (updatedVote?.questions) {
      setLocalOptions(updatedVote.questions);
    }
  };

  // lay vote theo id
  
  useEffect(() => {
    if (voteId) {
      const fetchVote = async () => {
        try {
          const response = await getVoteById(voteId);
          console.log('Vote data fetched:=================================', response);
          console.log('99999999999999999999999999', response.addOption);
          if (response.status === 'SUCCESS' && response.response) {
            setLocalOptions(response.response.questions || []);
          }
        } catch (error) {
          console.error('Error fetching vote by ID:', error);
          Alert.alert('Lỗi', 'Không thể tải thông tin bình chọn');
        }
      }
      fetchVote();
    }
  }, [voteId]);


  // Log user info
  console.log("Nhật ký: USER hiện tại------1111--------------", userProfile);
  console.log("User ID:+++++++++++++++++++++++", userProfile?.id);
  console.log("Vote ID:-------222---------", voteId);
  console.log("Options:", options);
  console.log("Selected Option:=====================", selectedOption);
  console.log("Title:------------", title);
  console.log("Local Options:", localOptions);

  // Map lưu userId -> user info (avatar,...)
  const [userMap, setUserMap] = useState({});

  // Load thông tin avatar user đã vote mỗi option
  useEffect(() => {
    async function fetchUsers() {
      if (!options) return;

      const userIds = [...new Set(options.flatMap(opt => opt.userIds || []))];
      const map = {};
      for (const id of userIds) {
        try {
          const response = await getUserById(id);
          console.log(`User data fetched for id ${id}:`, response);
          if (response.status === 'SUCCESS' && response.response) {
            map[id] = response.response;
          }
        } catch (e) {
          console.warn('Lỗi lấy user', id, e);
        }
      }
      setUserMap(map);
    }
    fetchUsers();
  }, [options]);

  // Khi options hoặc user thay đổi thì tìm xem user đã vote option nào
  useEffect(() => {
    if (user && options && options.length > 0) {
      const idx = options.findIndex(opt => {
        if (!opt.userIds) return false;
        return opt.userIds.some(id => id === user.id);
      });
      if (idx !== -1) {
        setSelectedOption(idx);
      }
    }
  }, [user, options]);

  const handleVote = async () => {
    if (selectedOption === null) {
      Alert.alert('Thông báo', 'Vui lòng chọn một phương án để bình chọn');
      return;
    }
    if (!voteId || !userProfile?.id) {
      Alert.alert('Lỗi', 'Không xác định được bình chọn hoặc người dùng');
      return;
    }

    const questionContent = options[selectedOption].content || options[selectedOption];

    try {
      setLoading(true);
      const updatedVote = await sendVoteOption({
        voteId,
        questionContent,
        userId: userProfile.id,
      });
      Alert.alert('Thành công', 'Bình chọn thành công!');
      setLoading(false);
      if (onVoteSuccess) onVoteSuccess(updatedVote);
    } catch (error) {
      setLoading(false);
      console.error('Error sending vote:', error);
      const message = error.response?.data?.message || error.message || 'Lỗi khi gửi bình chọn';
      Alert.alert('Lỗi', message);
    }
  };

  return (
    <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12,  borderBottomWidth: 1,borderBottomColor: '#007bff',paddingBottom: 4, }}>
          <Text style={styles.title}>{title || 'Bình chọn'}</Text>
          <View  >
                {/* // nếu  */}
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4, }} onPress={() => setModalVisible(true)}>
                  <AntDesign name="pluscircleo" size={24} color="#007bff" />
                  {/* <FontAwesome name="folder" size={20} color="#007bff" /> */}
                  {/* <Text style={{ color: '#007bff', fontSize: 14, fontWeight: 'bold' }}>Chi tiết bình chọn</Text> */}
                </TouchableOpacity>

                <QuestionModalDetail
                  visible={modalVisible}
                  onClose={() => setModalVisible(false)}
                  voteId={voteId}
                  title={title}
                  options={options}
                  userMap={userMap}
                  loadingAddOption={loadingAddOption}
                  setLoadingAddOption={setLoadingAddOption}
                  onQuestionAdded={handleQuestionAdded}
                  />

          </View>

        </View>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedOption === index && { backgroundColor: '#cfe0fb' },
          ]}
          onPress={() => setSelectedOption(index)}
          activeOpacity={0.7}
          disabled={loading}
        >
          <View style={styles.radioCircle}>
            {selectedOption === index && <View style={styles.selectedRb} />}
          </View>
          <Text style={styles.optionText}>{option.content || option}</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.avatarList}>
            {(option.userIds || []).map(uid => {
              const userData = userMap[uid];
              if (!userData || !userData.avatar) return null;
              return (
                <Image
                  key={uid}
                  source={{ uri: userData.avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              );
            })}
          </ScrollView>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.voteButton, loading && { opacity: 0.6 }]}
        onPress={handleVote}
        disabled={loading}
      >
        <Text style={styles.voteButtonText}>
          {loading ? 'Đang gửi...' : 'BÌNH CHỌN'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Poll;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f2f6ff',
    borderRadius: 12,
    margin: 16,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8edf5',
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
  },
  radioCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007bff',
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  avatarList: {
    flexDirection: 'row',
    marginLeft: 100,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 6,
  },
  voteButton: {
    backgroundColor: '#dbeeff',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 14,
  },
  voteButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
