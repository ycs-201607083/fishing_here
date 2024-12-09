import React, { useEffect, useState } from "react";
import { Box, HStack, Table } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination";

export function BoardAnnouncement(props) {
  const [anList, setAnList] = useState([]);
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/announcement")
      .then((res) => res.data)
      .then((data) => {});
  }, []);

  return (
    <Box mx={"auto"}>
      <Table.Root size="sm" mx={"auto"} striped w="70%">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="15%">번호</Table.ColumnHeader>
            <Table.ColumnHeader>제목</Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"end"}>날짜</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body></Table.Body>
      </Table.Root>

      <PaginationRoot count={20} pageSize={2} defaultPage={1} variant="solid">
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </Box>
  );
}

export default BoardAnnouncement;
