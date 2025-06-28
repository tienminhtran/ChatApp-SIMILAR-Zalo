import instance from "./axios";


// lấy bài viết theo iduser /posts/user/id
export const getPostsMyByUserId = async (userId) => {
  try {
    const response = await instance.get(`/api/v1/posts/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts by user ID:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi lấy bài viết của người dùng");
  }
};


// lấy bạn bè theo iduser  /api/v1/friend/my-friends/
export const getFriendsByUserId = async (userId) => {
  try {
    const response = await instance.get(`/api/v1/friend/my-friends/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching friends by user ID:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi lấy danh sách bạn bè");
  }
};

// lấy danh sách tất ca cả bài viết /api/v1/posts/all
export const getAllPosts = async () => {
  try {
    const response = await instance.get('/api/v1/posts/all');
    return response.data;
  } catch (error) {
    console.error("Error fetching all posts:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi lấy tất cả bài viết");
  }
};

// lấy thong tin user khi biet id_user_friends
export const getUserById = async (id_user_friends) => {
  try {
    const response = await instance.get(`/api/v1/user/${id_user_friends}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi lấy thông tin người dùng");
  }
};

//     @GetMapping("/users-with-posts")
export const getUsersWithPosts = async () => {
  try {
    const response = await instance.get('/api/v1/posts/users-with-posts');
    return response.data;
  } catch (error) {
    console.error("Error fetching users with posts:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi lấy người dùng có bài viết");
  }
};

// save
export const savePost = async (postData) => {
  try {
    const response = await instance.post('/api/v1/posts/save', postData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
    });
    return response.data;
  } catch (error) {
    console.error("Error saving post:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi lưu bài viết");
  }
};
//XÓA http://localhost:8080/api/v1/posts/68319d0bd35a6033b682c0ff
export const deletePost = async (postId) => {
  try {
    const response = await instance.delete(`/api/v1/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi xóa bài viết");
  }
};


//update
export const updatePost = async ({postId, postData}) => {
  try {
    const response = await instance.put(`/api/v1/posts/update/${postId}`, postData);
    return response.data;
  } catch (error) {
    console.error("Error updating post:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi cập nhật bài viết");
  }
};

// save binh luan http://localhost:8080/api/v1/postactivity/save
// export const saveComment = async (postId, userIdPost, userIdActor, commentData) => {
//   try {
//     const response = await instance.post('/api/v1/postactivity/save', {
//       postId,
//       userIdPost,
//       userIdActor,
//       commentData
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Error saving comment:", error.response?.data || error.message);
//     throw new Error(error.response?.data?.message || "Lỗi khi lưu bình luận");
//   }

// };
// Hàm saveComment với header Content-Type
export const saveComment = async (postId, userIdPost, userIdActor, comment) => { 
  try {
    const response = await instance.post('/api/v1/postactivity/save', {
      postId,
      userIdPost,
      userIdActor,
      comment  // comment là string
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error saving comment:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi lưu bình luận");
  }
};


// lấy danh sách bình luận theo postId http://localhost:8080/api/v1/postactivity/post/comment/683301663dbd51227e1a3fc2
export const getCommentsByPostId = async (postId) => {
  try {
    const response = await instance.get(`/api/v1/postactivity/post/comment/${postId}`);
    console.log("Response data:=============================", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments by post ID:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi lấy bình luận của bài viết");
  }
};


//http://localhost:8080/api/v1/postactivity/post/comment/count/6833038e3dbd51227e1a3fc6
export const getCommentCountByPostId = async (postId) => {
  try {
    const response = await instance.get(`/api/v1/postactivity/post/comment/count/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comment count by post ID:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi lấy số lượng bình luận của bài viết");
  }
};
// Cập nhật trạng thái like (tym) của user trên bài viết http://localhost:8080/api/v1/postactivity/post/6833038e3dbd51227e1a3fc6/user/67fb51ce6993e15db49bf32f/tym
export const updateLikeStatus = async (postId, userId) => {
  try {
    const liked = await checkLikedStatus(postId, userId);
    const response = await instance.put(`/api/v1/postactivity/post/${postId}/user/${userId}/tym`, { liked: !liked });
    return response.data;
  } catch (error) {
    console.error("Error updating like status:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái like");
  }
};
// Kiem tra trang thai like (tym) cua user tren bai viet http://localhost:8080/api/v1/postactivity/post/6833038e3dbd51227e1a3fc6/user/67fb51ce6993e15db49bf32f/tym
/*
{
    "liked": false
}*/
export const checkLikedStatus = async (postId, userId) => {
  try {
    const response = await instance.get(`/api/v1/postactivity/post/${postId}/user/${userId}/tym`);
    return response.data.liked; // Giả sử API trả về { liked: true/false }
  } catch (error) {
    console.error("Error checking liked status:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi kiểm tra trạng thái like");
  }
};



/*
// xóa bình luận theo id activity
    @DeleteMapping("/activity/{activityId}")
*/
export const deleteComment = async (activityId) => {
  try {
    const response = await instance.delete(`/api/v1/postactivity/activity/${activityId}`);
    return response.data;
  }
  catch (error) {
    console.error("Error deleting comment:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi xóa bình luận");
  }
};

//     @PutMapping("/activity/{activityId}/comment/{comment}")

// update bình luận theo id activity
export const updateComment = async (activityId, comment) => {
  try {
    const response = await instance.put(`/api/v1/postactivity/activity/${activityId}/comment/${comment}`);
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi cập nhật bình luận");
  }
};