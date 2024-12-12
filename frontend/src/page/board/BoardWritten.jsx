import { Box } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

export function BoardWritten() {
  const [, set] = useState();

  useEffect(() => {
    axios.get(`/api/board/list/:id`);
  }, []);
  return <Box></Box>;
}
