import { apiClient } from "@/config";

const getUserProfileByUsername = async (username) => {
    return await apiClient.get(`/user/u/${username}`)
};

const getCurrentUser=async()=>{
  return await apiClient.get("/user/profile")
}

export { getUserProfileByUsername ,getCurrentUser};
