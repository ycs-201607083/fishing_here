import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@chakra-ui/react";

function ImageFileView({ files }) {
  return (
    <Box>
      {files.map((file) => (
        <Image
          key={file.name}
          src={file.src}
          my={3}
          border={"1px solid black"}
        />
      ))}
    </Box>
  );
}

function BoardView(props) {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    axios.get(`api/board/view/${id}`).then((res) => setBoard(res.data));
  }, []);
  return (
    <div>
      <p>글작성 완료</p>
      <p>${board}</p>
    </div>
  );
}

export default BoardView;
