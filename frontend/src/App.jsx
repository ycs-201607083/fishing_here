import axios from "axios";
import { MemberLogin } from "./page/member/MemberLogin.jsx";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthenticationProvider from "./context/AuthenticationProvider.jsx";
import { LoginKakaoHandler } from "./page/kakao/LoginKakaoHandler.jsx";

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
    path: "/auth",
    element: <LoginKakaoHandler />,
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
