import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/service/UserService";
import { useAuth } from "@/hooks";
import { login } from "@/redux";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const { dispatch } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getCurrentUser();

        const user = response.data.data;
        
        dispatch(
          login({
            user,
          }),
        );

        navigate("/dashboard", { replace: true });
      } catch (error) {

        navigate("/signin", { replace: true });
      }
    };

    getUser();
  }, [dispatch, navigate]);

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      Signing you in...
    </div>
  );
}