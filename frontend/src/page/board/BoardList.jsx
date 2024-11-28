import { useEffect, useState } from "react";
import axios from "axios";
import {
  HStack,
  IconButton,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  Stack,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export function BoardList() {
  const navigate = useNavigate();

  const [boardList, setBoardList] = useState([]);
  const [search, setSearch] = useState("전체");
  const [searchValue, setSearchValue] = useState("");

  const fetchBoards = () => {
    axios
      .get("/api/board/list", {
        params: { field: searchField, value: searchValue },
      })
      .then((res) => res.data)
      .then((data) => setBoardList(data));
  };

  function handleRowClick(id) {
    navigate(`/view/${id}`);
  }

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleSearch = () => {
    fetchBoards();
  };

  return (
    <div>
      {/*검색 기능*/}
      <HStack>
        <NativeSelectRoot
          value={search}
          onChange={(e) => setSearch({ ...search, type: e.target.value })}
        >
          <NativeSelectField
            items={[
              { label: "전체", value: "all" },
              { label: "제목", value: "board_title" },
              { label: "작성자", value: "board_write" },
            ]}
          ></NativeSelectField>
        </NativeSelectRoot>

        <Input
          type="text"
          placeholder="Please enter your search term..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />

        <IconButton aria-label="Search database" onClick={handleSearch}>
          <LuSearch />
        </IconButton>
      </HStack>

      {/* 목록 */}

      {boardList.map((board) => (
        <Stack
          key={board.board_number}
          onClick={() => handleRowClick(board.board_number)}
        >
          <div>{board.board_number}</div>
          <div>{board.board_title}</div>
          <div>{board.board_writer}</div>
          <div>{board.board_view_count}</div>
          <div>{board.board_date}</div>
        </Stack>
      ))}
    </div>
  );
}
