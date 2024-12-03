import React from 'react';
import {Box} from "@chakra-ui/react";
import GoogleMapApi from "../../components/map/GoogleMapApi.jsx";

export function BoardMap(props) {
  return (
    <Box>
      <GoogleMapApi/>
    </Box>
  );
}

export default BoardMap;