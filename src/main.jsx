import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import App from "./App";
import "antd/dist/reset.css";
import { ConfigProvider } from "antd";
import srRS from "antd/locale/sr_RS";
import NotificationProvider from "./components/Elektronska/context/NotificationContext.jsx";

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={srRS}
        theme={{
          token: {
            fontFamily: "Inter",
          },
          components: {
            Button: {
              colorPrimary: "#067bc2",
              fontSize: "1.25rem",
              fontWeight: "500",
              algorithm: true, // Ensures proper theming adjustments
            },
            Tabs: {
              //inkBarColor: "#067bc2", // Active tab border
              itemSelectedColor: "#067bc2", // Active tab text color
              titleFontSize: "1.1rem",
              cardGutter: "0.5rem",
            },
            Form: {
              labelFontSize: "1rem",
            },
          },
        }}
      >
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ConfigProvider>
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  </React.StrictMode>
);
