import { Box, Image } from "@chakra-ui/react";
import React from "react";

export function ImageFileView({ files }) {
  return (
    <Box>
      {files.map((file) => (
        <Image
          p={5}
          key={file.name}
          src={file.src}
          alt={file.name || "첨부 이미지"}
          maxW={"80%"}
          mx={"auto"}
        />
      ))}
    </Box>
  );
}
