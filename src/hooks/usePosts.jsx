import { useDispatch, useSelector } from "react-redux";
import { loadPost, addPost, removePost, updatePost } from "@/redux";
import {
  getAllPostByUser,
  createPost,
  deletePost,
  updatePost as updatePostApi,
} from "@/service";

export default function usePosts() {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.post.posts);

  const fetchPosts = async () => {
    try {
      const response = await getAllPostByUser();
      dispatch(
        loadPost({
          posts: response.data.data,
        }),
      );

      return response;
    } catch (error) {
      dispatch(loadPost([]));
    }
  };

  const createNewPost = async (data) => {
    const response = await createPost(data);

    dispatch(addPost(response.data.post));

    return response;
  };

  const deleteUserPost = async (postId) => {
    const response = await deletePost(postId);
    dispatch(removePost(postId));
    return response;
  };

  const editPost = async (postId, data) => {
    const response = await updatePostApi(postId, data);

    dispatch(updatePost(response.data.post));

    return response;
  };

  return {
    posts,
    fetchPosts,
    createNewPost,
    deleteUserPost,
    editPost,
  };
}
