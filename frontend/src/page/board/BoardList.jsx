import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  HStack,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { LuSearch, LuTerminal } from "react-icons/lu";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "../../components/ui/native-select.jsx";
import * as board from "prop-types";

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
  /*  const navigate = useNavigate();*/ // 네비게이션

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

  function handleRowClick(id) {
    console.log(`${board.number}번 view로 연동하기`);
    // navigate(`/view/${number}`); //클릭시 네비게이션 연동
  }

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
        <SimpleGrid columns={[1, 2, null, 3, 4]} gap="40px">
          {boardList.map((board) => (
            <Card.Root key={board.number} width="320px" mb="4">
              <Card.Body gap="2">
                <Image
                  rounded="md"
                  src="https://bit.ly/dan-abramov"
                  alt="Dan Abramov"
                />
                <HStack justifyContent="space-between" mt="1">
                  <Text fontSize="sm" color="gray.500">
                    {board.site}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Views: {board.view}
                  </Text>
                </HStack>
                <Card.Title mt="2">{board.title}</Card.Title>
                <Text fontSize="sm" color="gray.500" mt="1">
                  {board.writer}
                </Text>
                <Card.Description>{board.content}</Card.Description>
              </Card.Body>
              <Card.Footer justifyContent="flex-end">
                <Button
                  variant="outline"
                  onClick={() => handleRowClick(board.id)}
                  key={board.id}
                >
                  View
                </Button>
              </Card.Footer>
            </Card.Root>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
