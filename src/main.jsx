import { createRoot } from "react-dom/client";
import "./index.css";
import { App, store } from "@/app";
import { Provider } from "react-redux";
import {
  axiosRequestInterceptor,
  axiosResponseInterceptor,
} from "@/config";

axiosRequestInterceptor(store);
axiosResponseInterceptor(store);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
