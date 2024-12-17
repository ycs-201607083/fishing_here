import React, { useState } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";
import { Checkbox } from "../ui/checkbox";

export function ImagDeleteView({ files, onRemoveSwitchClick }) {
  // 체크 상태를 관리할 state 추가
  const [blurredImages, setBlurredImages] = useState({});

  const handleCheckboxChange = (isChecked, fileName) => {
    setBlurredImages((prev) => ({
      ...prev,
      [fileName]: isChecked, // 이미지의 blur 상태를 업데이트
    }));
    onRemoveSwitchClick(isChecked, fileName); // 기존 콜백 호출
  };

  return (
    <Box maxW={"70%"} mx={"auto"}>
      {files.map((file) => (
        <Flex key={file.name} align="center">
          <Image
            src={file.src}
            w={"30%"}
            style={{
              filter: blurredImages[file.name] ? "blur(4px)" : "none", // 흐림 효과 추가
              transition: "filter 0.3s", // 부드러운 전환 효과
            }}
          />
          <Checkbox
            invalid
            pl={3}
            onChange={(e) => handleCheckboxChange(e.target.checked, file.name)}
          >
            삭제
          </Checkbox>
        </Flex>
      ))}
    </Box>
  );
}
