import React, { useContext, useEffect, useState } from "react";
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
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";

export function BoardAnnouncement() {
  const [anList, setAnList] = useState([]);
  const [count, setCount] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { id, kakaoId, isAdmin, isAuthenticated, logout } = useContext(
    AuthenticationContext,
  );

  //페이지 번호얻기
  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  useEffect(() => {
    // CleanUp : 이전 페이지 요청 취소하고 현재 페이지로 다시 업데이트
    const controller = new AbortController();
    axios
      .get("/api/board/announcement", {
        params: searchParams,
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

  function handleRowClick(id) {
    navigate(`/board/viewAnn/${id}`);
  }

  return (
    <VStack>
      <Table.Root interactive size="sm" mx={"auto"} striped w="70%">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="15%" whiteSpace={"nowrap"}>
              번호
            </Table.ColumnHeader>
            <Table.ColumnHeader w="40%" whiteSpace={"nowrap"}>
              제목
            </Table.ColumnHeader>
            <Table.ColumnHeader w="5%" whiteSpace={"nowrap"}>
              작성자
            </Table.ColumnHeader>
            <Table.ColumnHeader w="10%" whiteSpace={"nowrap"}>
              작성일
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {anList.map((board) => (
            <Table.Row key={board.id} onClick={() => handleRowClick(board.id)}>
              <Table.Cell whiteSpace={"nowrap"}>{board.id}</Table.Cell>
              <Table.Cell whiteSpace={"nowrap"}>{board.title}</Table.Cell>
              <Table.Cell whiteSpace={"nowrap"}>{board.writer}</Table.Cell>
              <Table.Cell whiteSpace={"nowrap"}>{board.inserted}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Box ml={"60%"}>
        {isAdmin && <Button onClick={handleWriteContent}>글쓰기</Button>}
      </Box>
      <Center>
        <PaginationRoot
          onPageChange={handlePageChange}
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
