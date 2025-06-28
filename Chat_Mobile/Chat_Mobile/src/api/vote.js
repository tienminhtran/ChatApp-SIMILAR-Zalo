import instance from "./axios";



// save vote http://localhost:8080/api/v1/vote/create

// Hàm tạo vote, truyền vào object vote theo đúng định dạng backend yêu cầu
export const createVote = async (voteData) => {
  try {
    const response = await instance.post("/api/v1/vote/create", voteData);
    return response.data; // dữ liệu vote trả về từ server
  } catch (error) {
    // Bắn lỗi để component gọi có thể catch xử lý
    throw error.response?.data || error.message || "Lỗi khi tạo vote";
  }
};

// hiển thị danh sách vote 
export const getLatestVoteByGroupId = async (groupId) => {
  try {
    const response = await instance.get(`/api/v1/vote/group/${groupId}`);
    return response.data; // danh sách vote trả về từ server
  } catch (error) {
    // Bắn lỗi để component gọi có thể catch xử lý
    throw error.response?.data || error.message || "Lỗi khi lấy danh sách vote";
  }
};


// Hàm gửi bình chọn của người dùng http://localhost:8080/api/v1/vote/voteoption?voteId=6836c69a3382895a29583357&questionContent=banh&userId=680260c925bfd85d71869754
export const sendVoteOption = async ({ voteId, questionContent, userId }) => {
  try {
    const response = await instance.post('/api/v1/vote/voteoption', null, {
      params: { voteId, questionContent, userId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// http://localhost:8080/api/v1/vote/add-question?voteId=6837042ff78dbb6094699a98&questionContent=T6
export const addVoteQuestion = async ({ voteId, questionContent }) => {
  try {
    const response = await instance.post('/api/v1/vote/add-question', null, {
      params: { voteId, questionContent },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Get vote by ID
export const getVoteById = async (voteId) => {
  try {
    const response = await instance.get(`/api/v1/vote/${voteId}`);
    return response.data; // trả về dữ liệu vote
  } catch (error) {
    throw error.response?.data || error.message || "Lỗi khi lấy thông tin vote";
  }
};