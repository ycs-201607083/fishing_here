import React, { createContext, useContext, useState } from "react";

// Context 생성
const AddressContext = createContext("");

// Context Provider 정의
export const AddressProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  console.log("ContextAddress. address\n", address);
  console.log("ContextAddress. SETADDRESS\n", setAddress);

  return (
    <AddressContext.Provider
      value={{ address, setAddress, lat, setLat, lng, setLng }}
    >
      {children}
    </AddressContext.Provider>
  );
};

// Context를 쉽게 사용할 수 있는 커스텀 훅
export const useAddress = () => {
  return useContext(AddressContext);
};
