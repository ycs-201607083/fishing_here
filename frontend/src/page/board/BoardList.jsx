import {
  Alert,
  Box,
  Center,
  HStack,
  IconButton,
  Input,
  Spinner,
  Table,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { LuSearch, LuTerminal } from "react-icons/lu";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "../../components/ui/native-select.jsx";

export function BoardList() {
  // 게시판 데이터 상태
  const [boardList, setBoardList] = useState([]);
  // 검색 키워드
  const [keyword, setKeyword] = useState("");
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  // 에러 메시지 상태
  const [errorMessage, setErrorMessage] = useState("");
  // 검색 데이터
  const [searchParams, setSearchParams] = useSearchParams("");
  // 검색 타입(제목...)
  const [type, setType] = useState("all"); // 검색 타입 (전체, 제목, 본문 중 선택)
  // 검색 타입(장소)
  const [site, setSite] = useState("allSite");

  useEffect(() => {
    fetchBoardList();
  }, [searchParams, type, site]);

  const fetchBoardList = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get("/api/board/list", {
        params: Object.fromEntries(searchParams.entries()), //**URL의 쿼리스트링을 서버로 전달
        //entries() : 키-값 쌍의 반복 가능한 이터레이터
      });

      console.log(response);
      setBoardList(response.data);
    } catch (error) {
      console.error("데이터를 불러오는데 실패했습니다.");
      setErrorMessage("데이터를 불러오는 데 실패하였습니다."); // ** 에러 메시지 추가
    } finally {
      setIsLoading(false);
    }
  };
  console.log(searchParams.get("keyword"));

  return (
    <Box>
      <h3>게시물 목록</h3>

      <HStack mb={4}>
        <NativeSelectRoot size="sm" width="240px">
          <NativeSelectField
            value={site} // **
            onChange={(e) => setSite(e.target.value)}
          >
            <option value={"allSite"}>민물/바다</option>
            <option value={"riverSite"}>민물낚시</option>
            <option value={"seaSite"}>바다낚시</option>
          </NativeSelectField>
        </NativeSelectRoot>

        <NativeSelectRoot size="sm" width="240px">
          <NativeSelectField
            value={type} // **
            onChange={(e) => setType(e.target.value)}
          >
            <option value={"all"}>전체</option>
            <option value={"title"}>제목</option>
            <option value={"content"}>본문</option>
            <option value={"writer"}>작성자</option>
          </NativeSelectField>
        </NativeSelectRoot>

        <Input
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <IconButton
          aria-label="Search database"
          onClick={(e) => setSearchParams({ type, keyword, site })} // **
        >
          <LuSearch />
        </IconButton>
      </HStack>
      {isLoading ? (
        <Center h="100vh">
          <HStack gap="5">
            <Spinner size="xl" />
          </HStack>
        </Center>
      ) : errorMessage ? (
        <Alert title="Alert Title" icon={<LuTerminal />}>
          데이터를 불러오는 데 실페하였습니다.
        </Alert>
      ) : boardList.length === 0 ? ( // ** 검색 결과 없음 조건
        <Center flexDirection="column" gap={2}>
          <h2>해당 게시글이 없습니다.</h2>
          <Box as="p" fontSize="sm" color="gray.600" mt={2} textAlign="center">
            검색어를 수정하시거나, 다른 조건으로 검색해주세요.
          </Box>
        </Center>
      ) : (
        <Table.Root interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>번호</Table.ColumnHeader>
              <Table.ColumnHeader>낚시 장소</Table.ColumnHeader>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>본문</Table.ColumnHeader>
              <Table.ColumnHeader>작성자</Table.ColumnHeader>
              <Table.ColumnHeader>조회수</Table.ColumnHeader>
              <Table.ColumnHeader>작성일시</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {boardList.map((board) => (
              <Table.Row key={board.number}>
                <Table.Cell>{board.number}</Table.Cell>
                <Table.Cell>{board.site}</Table.Cell>
                <Table.Cell>{board.title}</Table.Cell>
                <Table.Cell>{board.content}</Table.Cell>
                <Table.Cell>{board.writer}</Table.Cell>
                <Table.Cell>{board.viewCount}</Table.Cell>
                <Table.Cell>{board.date}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </Box>
  );
}
