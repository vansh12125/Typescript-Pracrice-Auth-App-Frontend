import { apiClient } from "@/config";

const createPost = async (postData) => {
  return await apiClient.post("/posts/post", postData);
};

const getPost = async (postId) => {
  return await apiClient.get(`/posts/post/${postId}`);
};

const getAllPost = async () => {
  return await apiClient.get("/posts/all");
};

const getPostByQuery = async (query) => {
  return await apiClient.get(`/posts/post/query=${query}`);
};

const getAllPostByUser = async () => {
  return await apiClient.get(`/posts/my`);
};

const getAllPublicPostByUser = async (userId) => {
  return await apiClient.get(`/posts/u/${userId}`);
};

const likePost = (postId) => {
  return apiClient.post(`/posts/${postId}/like`);
};

const unLikePost = (postId) => {
  return apiClient.post(`/posts/${postId}/unlike`);
};

const deletePost = async (postId) => {
  return await apiClient.delete(`/posts/post/${postId}`);
};

const getPostByIdAndValidateUser = async (postId) => {
  return await apiClient.get(`/posts/post/${postId}/verify`);
};

const updatePost = async (postId, postData) => {
  return await apiClient.patch(`/posts/post/${postId}`, postData);
};

const addComment = async (data) => {
  return await apiClient.post(`/comment/create`, data);
};

const deleteComment = async (data) => {
  return await apiClient.post(`/comment/delete/${data.commentId}`, data);
};

const getAllComments = async (postId) => {
  return await apiClient.post(`/comment/all`, { postId: postId });
};

export {
  createPost,
  getPost,
  getAllPost,
  getAllPostByUser,
  likePost,
  unLikePost,
  deletePost,
  getPostByIdAndValidateUser,
  updatePost,
  getAllPublicPostByUser,
  getPostByQuery,
  addComment,
  deleteComment,
  getAllComments,
};
