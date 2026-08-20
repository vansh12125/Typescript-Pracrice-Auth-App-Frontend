import { configureStore } from "@reduxjs/toolkit";
import {authReducer,postReducer,feedPostsReducer} from "@/redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post:postReducer,
    feed:feedPostsReducer
  },
});
