import React, { useEffect, useState } from "react";
import { Box, Center, HStack, Table, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination";
import { Button } from "../../components/ui/button.jsx";

export function BoardAnnouncement() {
  const [anList, setAnList] = useState([]);
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  //페이지 번호얻기
  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  useEffect(() => {
    // CleanUp : 이전 페이지 요청 취소하고 현재 페이지로 다시 업데이트
    const controller = new AbortController();
    axios
      .get("/api/board/announcement", {
        params: setSearchParams,
        signal: controller.signal,
      })
      .then((res) => res.data)
      .then((data) => {
        setAnList(data.list);
        setCount(data.count);
      });

    return () => {
      controller.abort();
    };
  }, [searchParams]);

  function handlePageChange(e) {
    console.log(e.page);
    const nextSearchParam = URLSearchParams(searchParams);
    nextSearchParam.set("page", e.page);
    setSearchParams(nextSearchParam);
  }

  const handleWriteContent = () => {
    navigate("/board/annAdd");
  };

  return (
    <VStack>
      <Table.Root size="sm" mx={"auto"} striped w="70%">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="15%">번호</Table.ColumnHeader>
            <Table.ColumnHeader>제목</Table.ColumnHeader>
            <Table.ColumnHeader>작성자</Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"end"}>날짜</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {anList.map((board) => (
            <Table.Row>
              <Table.Cell>{board.id}</Table.Cell>
              <Table.Cell>{board.title}</Table.Cell>
              <Table.Cell>{board.witer}</Table.Cell>
              <Table.Cell>{board.inserted}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Box ml={"60%"}>
        <Button onClick={handleWriteContent}>글쓰기</Button>
      </Box>
      <Center>
        <PaginationRoot
          onPageChage={handlePageChange}
          count={count}
          pageSize={10}
          page={page}
          variant="solid"
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Center>
    </VStack>
  );
}

export default BoardAnnouncement;
