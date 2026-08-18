import { ProfileDashboard, EditProfile,CreatePost,Feeds ,MyPosts,EditPost,UserProfile,PostPage,Settings,ChangePassword} from "@/pages/secure";

export const securedRoutes = [
  {
    path: "dashboard",
    element: <ProfileDashboard />,
  },
  {
    path: "edit-profile",
    element: <EditProfile />,
  },
  {
    path: "change-password",
    element: <ChangePassword />,
  },
  {
    path: "create-post",
    element: <CreatePost />,
  },
  {
    path: "feed",
    element: <Feeds />,
  },
  {
    path: "my-posts",
    element: <MyPosts />,
  },
  {
    path: "edit-post/:postId",
    element: <EditPost />,
  },
  {
    path: "/u/:username",
    element: <UserProfile />,
  },
  {
    path: "/post/:postId",
    element: <PostPage />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
];
