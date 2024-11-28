import axios from "axios";
import { MemberLogin } from "./page/member/MemberLogin.jsx";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { LoginKakaoHandler } from "./page/kakao/LoginKakaoHandler.jsx";
import LoginSuccess from "./page/kakao/LoginSuccess.jsx";
import AuthenticationProvider from "./context/AuthenticationProvider.jsx";

// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// react router 설정
const router = createBrowserRouter([
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
