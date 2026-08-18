import { useEffect } from "react";
import { getCurrentUser } from "@/service/UserService";
import { login, logout, finishInitialization } from "@/redux";
import { useAuth } from "@/hooks";
import { LoadingAnimation } from "@/components/ui";

export default function AuthInitializer({ children }) {
  const { initialized, dispatch } = useAuth();

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const response = await getCurrentUser();

        if (!mounted) return;

        dispatch(
          login({
            user: response.data.data,
          })
        );
      } catch (error) {
        if (!mounted) return;

        dispatch(logout());
      } finally {
        if (mounted) {
          dispatch(finishInitialization());
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (!initialized) {
    return <LoadingAnimation />;
  }

  return children;
}