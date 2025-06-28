import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  Pressable,
  Image
} from 'react-native';
import {
  Ionicons,
  FontAwesome5,
  MaterialIcons,
  Entypo,
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { useDispatch, useSelector } from 'react-redux';
import { savePost, updatePost } from '../../api/postApi';
import * as ImagePicker from "expo-image-picker";
import { GEMINI_API_URL } from "@env";
// Đọc danh sách từ khóa nhạy cảm từ file
import { offensiveWords } from './vn_offensive_words';
const PostStatusScreen = ({ route }) => {

  const fonts = [
    { idFonts: 0, name: 'Fountain', key: 'f1' },
    { idFonts: 1, name: 'Pixel', key: 'f2' },
    { idFonts: 2, name: 'Vintage', key: 'f3' },
    { idFonts: 3, name: 'Terminal', key: 'f4' },
    { idFonts: 4, name: 'Florence', key: 'f5' },
    { idFonts: 5, name: 'Retro', key: 'f6' },
    { idFonts: 6, name: 'Graffiti', key: 'f7' },
    { idFonts: 7, name: 'Signature', key: 'f8' },
  ];

  const fontColors = {
    Fountain: ['#FF6347', '#FFA07A'],
    Pixel: ['#1E90FF', '#87CEFA'],
    Vintage: ['#8B4513', '#D2B48C'],
    Terminal: ['#32CD32', '#7CFC00'],
    Florence: ['#BA55D3', '#DDA0DD'],
    Retro: ['#FFD700', '#FFA500'],
    Graffiti: ['#DC143C', '#FF69B4'],
    Signature: ['#000000', '#696969'],
  };

  const { postToEdit } = route.params || {};
  console.log("Nhật ký: postToEdit", postToEdit);

  const [text, setText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [selectedFont, setSelectedFont] = useState('Fountain');
  const [image, setImage] = useState(null);
  const navigation = useNavigation();

  const fontMap = Object.fromEntries(fonts.map(f => [f.name, f.key]));

  const [loaded] = useFonts({
    f1: require('../../../assets/font/f1.ttf'),
    f2: require('../../../assets/font/f2.ttf'),
    f3: require('../../../assets/font/f3.ttf'),
    f4: require('../../../assets/font/f4.ttf'),
    f5: require('../../../assets/font/f5.ttf'),
    f6: require('../../../assets/font/f6.ttf'),
    f7: require('../../../assets/font/f7.ttf'),
    f8: require('../../../assets/font/f8.ttf'),
  });

  if (!loaded) return null;

  useEffect(() => {
    if (postToEdit) {
      setText(postToEdit.content);
      const font = fonts.find(f => f.idFonts === postToEdit.fonts);
      if (font) {
        setSelectedFont(font.name);
      }
    }
  }, [postToEdit]);

  // const pickImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   if (!result.canceled) {
  //     const image = result.assets[0];
  //     setImage({
  //       uri: image.uri,
  //       name: image.fileName || "avatar.jpg",
  //       type: "image/jpeg",
  //     });
  //   }
  // };


// Hàm chọn hình ảnh
const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
    base64: true, // Thêm base64 để lấy dữ liệu ảnh dạng base64
  });

  if (!result.canceled) {
    const image = result.assets[0];
    setImage({
      uri: image.uri,
      name: image.fileName || "avatar.jpg",
      type: "image/jpeg",
      base64: image.base64, // Lưu base64 để gửi lên API
    });
    // Gọi hàm phân tích hình ảnh
    analyzeImage(image.base64);
  }
};

const analyzeImage = async (base64Image) => {
  try {
    const endpoint = `${GEMINI_API_URL}`;
    const promptText = "Phân tích nội dung hình ảnh và mô tả ngắn gọn trong khoảng 100 từ. Bao gồm #hashtag liên quan. Hình ảnh này có vi phạm cộng đồng không (bạo lực, xâm hại, nhại cảm, khiêu dâm,...)? Nếu có chỉ ghi ngắn gọn Tiêu chuẩn: true, không có ghi Tiêu chuẩn: false.";

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Image, // Gửi dữ liệu base64 của hình ảnh
                },
              },
              { text: promptText },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error('Lỗi khi gọi Gemini API: ' + errorText);
    }

    const data = await response.json();
    const imageDescription = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có mô tả';

    // Log the content analysis
    console.log('Nội dung hình ảnh:', imageDescription);

    // Check if the image violates community standards (Tiêu chuẩn: true)
    if (imageDescription.includes('Tiêu chuẩn: true')) {
      console.log('Hình ảnh này vi phạm cộng đồng.');
      // Show a warning if the image violates community standards
      Alert.alert(
        'Cảnh báo', 
        'Hình ảnh này vi phạm cộng đồng (bạo lực, xâm hại, nhại cảm, khiêu dâm,...). Vui lòng chọn hình ảnh khác!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Remove the image when the user presses OK
              setImage(null); // Clear the image from the state
            }
          }
        ]
      );
    } else {
      console.log('Hình ảnh này hợp lệ.');
    }

    // (Tùy chọn) Cập nhật state hoặc hiển thị nội dung phân tích
    setSuggestion(imageDescription); // Display the description or suggestion

  } catch (error) {
    console.error('Lỗi khi phân tích hình ảnh:', error);
    Alert.alert('Lỗi', 'Không thể phân tích hình ảnh. Vui lòng thử lại.');
  }
};




  const checkForViolations = async (content) => {
    // Check for offensive words
    const containsOffensive = offensiveWords.some(word => content.toLowerCase().includes(word.toLowerCase()));
    if (containsOffensive) {
      return { isValid: false, message: 'Nội dung chứa từ ngữ không phù hợp. Vui lòng chỉnh sửa và thử lại.' };
    }

    // If no offensive words found, check for violation using Gemini API
    const violationPrompt = "Nội dung này có mang tính công kích, thù địch, phản động, hoặc đe dọa không? Nếu có, chỉ ghi ngắn gọn 'Tiêu chuẩn: true'. Nếu không, ghi 'Tiêu chuẩn: false'.";
    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: violationPrompt + '\nNội dung: ' + content },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error('Lỗi khi gọi Gemini API: ' + errorText);
      }

      const data = await response.json();
      const violationResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Tiêu chuẩn: false';

      if (violationResponse.includes('Tiêu chuẩn: true')) {
        return { isValid: false, message: 'Nội dung này chứa yếu tố công kích, thù địch, hoặc đe dọa. Vui lòng chỉnh sửa và thử lại.' };
      }

      // Content passed both checks
      return { isValid: true, message: '' };
    } catch (error) {
      console.error('Lỗi khi kiểm tra nội dung:', error);
      return { isValid: false, message: 'Không thể kiểm tra nội dung. Vui lòng thử lại.' };
    }
  };


  // Hàm gọi Gemini API (thay bằng API thật của bạn)
// const fetchSuggestion = async (keyword) => {
//   const apiKey = 'AIzaSyDXYjSgtX6Eek4Loi82kRGjB6s7L7Rog3E'; // Thay bằng API key thật của bạn
//   const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

//   const response = await fetch(endpoint, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       contents: [
//         {
//           parts: [
//             { text: `Viết nội dung gợi ý cho từ khóa: "${keyword}"` }
//           ]
//         }
//       ]
//     }),
//   });

//   if (!response.ok) {
//     const errorText = await response.text();
//     throw new Error('Lỗi khi gọi Gemini API: ' + errorText);
//   }

//   const data = await response.json();

//   // Dữ liệu trả về có thể trong data?.candidates[0]?.output hay data?.candidates[0]?.content.parts[0].text
//   // Theo tài liệu, nội dung có thể trong data?.candidates[0]?.content.parts[0].text
//   return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có gợi ý';
// };
const fetchSuggestion = async (keyword) => {
  const endpoint = `${GEMINI_API_URL}`;

  const promptText = `Viết nội dung gợi ý cho từ khóa: "${keyword}" trong khoảng 100 từ, có #hashtag. Mỗi câu bắt đầu bằng các biểu tượng ngẫu nhiên 👉, ✨, 🔥, 💡, 🌟`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        { parts: [ { text: promptText } ] }
      ],
      // Không thêm maxOutputTokens
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();_
    throw new Error('Lỗi khi gọi Gemini API: ' + errorText);
  }

  const data = await response.json();

  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Không có gợi ý';
};



  // Xử lý khi nhấn nút Gợi ý
  const handleSuggest = async () => {
    if (!keyword.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập từ khóa để gợi ý');
      return;
    }
    

    try {
      const result = await fetchSuggestion(keyword.trim());
      setSuggestion(result);
      setText(result); // Đẩy nội dung gợi ý vào ô nhập nội dung
    } catch (error) {
      Alert.alert('Lỗi', error.message || 'Không lấy được gợi ý');
    }
  };

  // Redux
  const dispatch = useDispatch();
  const userProfile = useSelector(state => state.user.user);
  const user = useMemo(() => userProfile || null, [userProfile]);

  const [privacy, setPrivacy] = useState('Quyền xem');
  const [isPublic, setIsPublic] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    setPrivacy(value);
    setIsPublic(value === 'Công khai');
    setModalVisible(false);
  };

  const handlePost = async () => {
    if (!text.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập nội dung trước khi đăng.');
      return;
    }
    const result = await checkForViolations(text);
    if (!result.isValid) {
      Alert.alert('Cảnh báo', result.message);
      setText(''); // Clear the text input
      return;
    }
    const selectedFontObj = fonts.find(f => f.name === selectedFont);
    const postData = {
      userId: userProfile.id,
      content: text,
      fonts: selectedFontObj.idFonts,
      public: isPublic,
    };

    const formData = new FormData();
    formData.append("request", JSON.stringify(postData), "application/json");

    try {
      if (postToEdit) {
        postData.id = postToEdit.id;
        await updatePost({ postId: postToEdit?.id, postData });
      } else {
        if (image) {
          formData.append("image", image);
        }
        await savePost(formData);
      }
      Alert.alert('Đã đăng', 'Nội dung của bạn đã được đăng!');
      navigation.goBack({ reload: true });
    } catch (error) {
      console.error('Lỗi khi đăng bài:', error);
      Alert.alert('Lỗi', 'Không thể đăng bài viết. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <View>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.headerText}>{privacy}</Text>
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setModalVisible(false)}
          >
            <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
              <View style={styles.modalContent}>
                <TouchableOpacity onPress={() => handleSelect('Công khai')}>
                  <Text style={styles.optionText}>
                    <FontAwesome5 name="user-friends" size={16} color="#007AFF" />
                    Công khai
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSelect('Chỉ mình tôi')}>
                  <Text style={styles.optionText}>
                    <FontAwesome5 name="lock" size={16} color="#007AFF" />
                    Chỉ mình tôi
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </View>

        <TouchableOpacity onPress={handlePost}>
          <Text style={styles.postButton}>{postToEdit ? 'Cập nhật' : 'Đăng'}</Text>
        </TouchableOpacity>
      </View>

      {/* Nhập từ khóa + nút Gợi ý */}
      <View style={{ flexDirection: 'row', marginVertical: 10, alignItems: 'center' }}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10, height: 40, paddingVertical: 5 }]}
          placeholder="Nhập từ khóa để gợi ý"
          value={keyword}
          onChangeText={setKeyword}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#1e90ff',
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 8,
          }}
          onPress={handleSuggest}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Gợi ý</Text>
        </TouchableOpacity>
      </View>

      {/* Hiển thị gợi ý */}
      {/* {suggestion ? (
        <View style={{
          backgroundColor: '#e0f7fa',
          padding: 10,
          borderRadius: 8,
          marginBottom: 10,
        }}>
          <Text style={{ color: '#00796b' }}>Gợi ý: {suggestion}</Text>
        </View>
      ) : null} */}

      {/* Input nội dung post */}
      <TextInput
        style={[
          styles.input,
          {
            fontFamily: fontMap[selectedFont],
            color: fontColors[selectedFont][0],
            height: image ? "40%" : "65%",
          },
        ]}
        placeholder="Bạn đang nghĩ gì?"
        placeholderTextColor="#aaa"
        value={text}
        onChangeText={setText}
        multiline
      />

      {/* Image Preview */}
      {image && (
        <View style={{ marginBottom: 20 }}>
          <Image
            source={{ uri: image.uri }}
            style={{ width: '100%', height: 200, borderRadius: 12 }}
            resizeMode="cover"
          />
        </View>
      )}


      {/* Font Selection */}
      <ScrollView horizontal style={styles.fontRow} showsHorizontalScrollIndicator={false}>
        {fonts.map((font) => (
          <TouchableOpacity
            key={font.name}
            style={[
              styles.fontButton,
              selectedFont === font.name && styles.selectedFont,
            ]}
            onPress={() => setSelectedFont(font.name)}
          >
            <Text style={{
              fontFamily: font.key,
              fontSize: 16,
              color: fontColors[font.name][0],
            }}>
              {font.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <FontAwesome5 name="smile" size={24} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickImage}
        >
          <MaterialIcons name="image" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="videocam" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="link" size={24} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Entypo name="location-pin" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    padding: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginBottom: 'auto',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 200,
    borderRadius: 8,
    padding: 15,
    elevation: 5,
    marginTop: 50,
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 8,
    color: '#007AFF',
  },
  postButton: {
    color: '#1e90ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    textAlignVertical: 'top',
    fontSize: 16,
    marginVertical: 10,
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fontRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  fontButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    height: 40,
    justifyContent: 'center',
  },
  selectedFont: {
    backgroundColor: '#1e90ff',
    borderColor: '#1e90ff',
    borderWidth: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: '#ccc',
    marginTop: 'auto',
  },
});

export default PostStatusScreen;
