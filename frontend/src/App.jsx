import axios from "axios";
import { MemberLogin } from "./page/member/MemberLogin.jsx";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { LoginKakaoHandler } from "./page/kakao/LoginKakaoHandler.jsx";
import LoginSuccess from "./page/kakao/LoginSuccess.jsx";
import AuthenticationProvider from "./context/AuthenticationProvider.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { BoardMain } from "./page/board/BoardMain.jsx";
import { RootLayout } from "./page/root/RootLayout.jsx";
import MemberSignup from "./page/member/memberSignup.jsx";


axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <BoardMain />,
      },
      {
        path: "member/signup",
        element: <MemberSignup />
      },
      {
        path: "member/login",
        element: <MemberLogin />,
      },
      {
        path: "kakao/auth",
        element: <LoginKakaoHandler />,
      },
      {
        path: "/loginSuccess",
        element: <LoginSuccess />,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <AuthenticationProvider>
        <RouterProvider router={router} />
      </AuthenticationProvider>
    </>
  );
}

export default App;
