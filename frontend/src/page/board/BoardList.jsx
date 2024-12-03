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

function SearchFilters({
  site,
  setSite,
  type,
  setType,
  keyword,
  setKeyword,
  onSearch,
}) {
  return (
    <HStack mb={4}>
      <NativeSelectRoot size="sm" width="240px">
        <NativeSelectField
          value={site}
          onChange={(e) => setSite(e.target.value)}
        >
          <option value="allSite">민물/바다</option>
          <option value="riverSite">민물낚시</option>
          <option value="seaSite">바다낚시</option>
        </NativeSelectField>
      </NativeSelectRoot>
      <NativeSelectRoot size="sm" width="240px">
        <NativeSelectField
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="all">전체</option>
          <option value="title">제목</option>
          <option value="content">본문</option>
          <option value="writer">작성자</option>
        </NativeSelectField>
      </NativeSelectRoot>
      <Input
        placeholder="검색어를 입력하세요"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <IconButton aria-label="Search database" onClick={onSearch}>
        <LuSearch />
      </IconButton>
    </HStack>
  );
}

function LoadingSpinner() {
  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
}

function ErrorMessage({ message }) {
  return (
    <Alert status="error" icon={<LuTerminal />}>
      {message}
    </Alert>
  );
}

function NoResults() {
  return (
    <Center flexDirection="column" gap={2}>
      <h2>해당 게시글이 없습니다.</h2>
      <Box as="p" fontSize="sm" color="gray.600" mt={2} textAlign="center">
        검색어를 수정하시거나, 다른 조건으로 검색해주세요.
      </Box>
    </Center>
  );
}

function BoardCard({ board }) {
  return (
    <Card.Root key={board.number} width="320px" mb="4">
      <Card.Body gap="2">
        <Image
          rounded="md"
          src={board.imageUrl || "/default-image.png"}
          alt={board.title || "Default Image"}
        />
        <Card.Title mt="2">{board.title}</Card.Title>
        <Text fontSize="sm" color="gray.500" mt="1">
          {board.site}
        </Text>
        <Text fontSize="sm" color="gray.500" mt="1">
          {board.writer}
        </Text>
        <Card.Description>{board.content}</Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline">View</Button>
      </Card.Footer>
    </Card.Root>
  );
}

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams("");
  const [type, setType] = useState("all");
  const [site, setSite] = useState("allSite");

  useEffect(() => {
    fetchBoardList();
  }, [searchParams]);

  const fetchBoardList = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.get("/api/board/list", {
        params: Object.fromEntries(searchParams.entries()),
      });

      setBoardList(response.data);
    } catch (error) {
      setErrorMessage("데이터를 불러오는 데 실패하였습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setSearchParams({ type, keyword, site });
  };

  return (
    <Box>
      <h3>게시물 목록</h3>
      <SearchFilters
        site={site}
        setSite={setSite}
        type={type}
        setType={setType}
        keyword={keyword}
        setKeyword={setKeyword}
        onSearch={handleSearch}
      />

      {isLoading ? (
        <LoadingSpinner />
      ) : errorMessage ? (
        <ErrorMessage message={errorMessage} />
      ) : boardList.length === 0 ? (
        <NoResults />
      ) : (
        <SimpleGrid columns={[1, 2, 3]} spacing={4}>
          {boardList.map((board) => (
            <BoardCard key={board.number} board={board} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
