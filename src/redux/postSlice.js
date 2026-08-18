import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  fetched: false,
};

const postSlice = createSlice({
  name: "postInfo",
  initialState,
  reducers: {
    loadPost(state, action) {
      state.posts = action.payload.posts;
      state.fetched=true;
    },
    addPost(state, action) {
      state.posts.unshift(action.payload);
    },
    removePost(state, action) {
      state.posts = state.posts.filter(
        (post) => post._id !== action.payload,
      );
    },
    updatePost(state, action) {
      const index = state.posts.findIndex(
        (post) => post.postId === action.payload.postId,
      );

      if (index !== -1) {
        state.posts[index] = action.payload;
      }
    },
    clearPost(state) {
      state.posts = [];
    },
  },
});

export const { addPost, removePost, updatePost, loadPost } = postSlice.actions;
export default postSlice.reducer;
