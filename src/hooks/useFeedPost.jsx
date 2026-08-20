import { useDispatch, useSelector } from "react-redux";
import { loadFeedPost } from "@/redux";
import { getAllPost } from "@/service";
import { useState } from "react";
let fetchPromise = null;

export default function useFeedPost() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const { posts, fetched } = useSelector((state) => state.feed);

  const fetchPosts = async (force = false) => {
    if (fetched && !force) {
      return;
    }
    if (fetchPromise) {
      return fetchPromise;
    }

    setLoading(true);
    fetchPromise = getAllPost()
      .then((response) => {
        dispatch(
          loadFeedPost({
            posts: response.data.data || [],
          }),
        );

        return response;
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
        throw error;
      })
      .finally(() => {
        setLoading(false);
        fetchPromise = null;
      });

    return fetchPromise;
  };

  return {
    loading,
    posts,
    fetched,
    fetchPosts,
  };
}
