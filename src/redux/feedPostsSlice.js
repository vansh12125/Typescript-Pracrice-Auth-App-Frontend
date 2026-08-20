import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  fetched: false,
};

const feedPostsSlice = createSlice({
  name: "feedPosts",

  initialState,

  reducers: {
    loadFeedPost(state, action) {
      state.posts = action.payload.posts;
      state.fetched = true;
    },

    updatePostLikes(state, action) {
      const { postId, userId, liked } = action.payload;

      const post = state.posts.find(
        (post) => (post.postId || post.id || post._id) === postId,
      );

      if (!post) return;

      if (!Array.isArray(post.likes)) {
        post.likes = [];
      }

      if (liked) {
        if (!post.likes.includes(userId)) {
          post.likes.push(userId);
        }
      } else {
        post.likes = post.likes.filter((id) => id !== userId);
      }
    },

    clearFeedPost(state) {
      state.posts = [];
      state.fetched = false;
    },
  },
});

export const { loadFeedPost, updatePostLikes, clearFeedPost } =
  feedPostsSlice.actions;

export default feedPostsSlice.reducer;
