import { useState } from 'react'
import axios from "axios";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

axios.interceptors.request.use(function (config){
  const token = localStorage.getItem("token");

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
})

function App() {

  return (
    <>
      <div>hello
      </div>
    </>
  )
}

export default App
