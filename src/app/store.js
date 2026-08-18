import { configureStore } from "@reduxjs/toolkit";
import {authReducer,postReducer} from "@/redux";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    post:postReducer,
  },
});
