import {
  Alert,
  Box,
  Button,
  Card,
  Center,
  Flex,
  HStack,
  IconButton,
  Image,
  Input,
  SimpleGrid,
  Spinner,
  Table,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LuSearch, LuTerminal } from "react-icons/lu";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "../../components/ui/native-select.jsx";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination";
import Slider from "react-slick";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";

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
  // 조회수 탑 3개 받기
  const [topBoards, setTopBoards] = useState([]);
  // 좋아요 탑 3개 받기
  const [likeTopBoards, setLikeTopBoards] = useState([]);
  // like 횟수
  const [likeCount, setLikeCount] = useState([]);

  const [searchPage, setSearchPage] = useSearchParams();
  const [count, setCount] = useState(0);

  const navigate = useNavigate();
  const authentication = useContext(AuthenticationContext);

  useEffect(() => {
    fetchBoardList();
    fetchTopBoards();
    fetchLikeTopBoards();
    howManyLike();
  }, [searchParams, type, site, searchPage]);

  const howManyLike = async () => {
    try {
      const response = await axios.get("/api/board/likeCount");
      setLikeCount(response.data);
      setLikeTopBoards(response.data);
    } catch (error) {
      console.error("좋아요 갯수 카운트 실패");
    }
  };

  const fetchLikeTopBoards = async () => {
    try {
      const response = await axios.get("/api/board/top-like"); // 상위 3개 좋아요 API 호출
      setLikeTopBoards(response.data); // 데이터 저장
    } catch (error) {
      console.error("인기 게시글 데이터를 가져오는 데 실패했습니다.");
    }
  };

  const fetchTopBoards = async () => {
    try {
      const response = await axios.get("/api/board/top-views"); // 상위 3개 조회수 API 호출
      setTopBoards(response.data); // 데이터 저장
    } catch (error) {
      console.error("인기 게시글 데이터를 가져오는 데 실패했습니다.");
    }
  };

  console.log(searchPage.toString());

  // page 번호
  const pageParam = searchPage.get("page") ? searchPage.get("page") : "1";
  const page = Number(searchParams.get("page") || "1");

  const handlePageChange = (e) => {
    console.log(e.page);
    const nextSearchParams = new URLSearchParams(searchPage);
    nextSearchParams.set("page", e.page);
    setSearchPage(nextSearchParams);
  };

  const fetchBoardList = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/board/list", {
        params: Object.fromEntries(searchPage.entries()), //**URL의 쿼리스트링을 서버로 전달
        //entries() : 키-값 쌍의 반복 가능한 이터레이터
      });

      console.log(response);
      setBoardList(response.data.list);
      setCount(response.data.count);
    } catch (error) {
      console.error("데이터를 불러오는데 실패했습니다.");
      setErrorMessage("데이터를 불러오는 데 실패하였습니다."); // ** 에러 메시지 추가
    } finally {
      setIsLoading(false);
    }
  };

  console.log(searchParams.get("keyword"));

  /*클릭 시 조회수 증가 처리 추가*/
  const handleRowClick = async (number) => {
    console.log(`${number}번 게시물 이동`);

    try {
      navigate(`/board/view/${number}`);
      await axios.post(`/api/board/list/${number}`);
      console.log(`${number}번 게시물 클릭으로 조회수 증가`);
    } catch (error) {
      console.error("조회수를 증가시키는 데 실패했습니다.");
    }
  };

  const handleWriteClick = () => {
    if (authentication.isAuthenticated) {
      navigate("/board/add"); // 로그인 상태에서 이동
    } else {
      window.alert("로그인이 필요합니다. 로그인 후 게시글 작성이 가능합니다."); // 경고창 표시
    }
  };

  return (
    <Box
      style={{
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
    >
      <HStack mb={4} justifyContent="center" style={{ gap: "20px" }}>
        {/* 드롭다운 - 낚시 장소 */}
        <NativeSelectRoot
          style={{
            width: "175px",
            maxHeight: "50px",
            fontSize: "14px",
            padding: "5px",
            border: "1px solid #0288d1",
            borderRadius: "4px",
          }}
        >
          <NativeSelectField
            value={site}
            onChange={(e) => setSite(e.target.value)}
          >
            <option value={"allSite"}>민물/바다</option>
            <option value={"riverSite"}>민물낚시</option>
            <option value={"seaSite"}>바다낚시</option>
          </NativeSelectField>
        </NativeSelectRoot>

        {/* 드롭다운 - 검색 타입 */}
        <NativeSelectRoot
          style={{
            width: "150px",
            maxHeight: "50px",
            fontSize: "14px",
            padding: "5px",
            border: "1px solid #0288d1",
            borderRadius: "4px",
          }}
        >
          <NativeSelectField
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value={"all"}>전체</option>
            <option value={"title"}>제목</option>
            <option value={"content"}>본문</option>
            <option value={"writer"}>작성자</option>
          </NativeSelectField>
        </NativeSelectRoot>

        {/* 검색창 */}
        <Input
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            maxWidth: "700px",
            width: "100%",
            maxHeight: "50px",
            height: "50px",
            padding: "8px",
            fontSize: "14px",
            border: "1px solid #0288d1",
            borderRadius: "20px",
            backgroundColor: "#ffffff",
          }}
        />

        {/* 검색 버튼 */}
        <IconButton
          aria-label="Search database"
          onClick={(e) => setSearchParams({ type, keyword, site })} // **
          style={{
            maxHeight: "50px",
            height: "30px",
            padding: "5px",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          <LuSearch />
        </IconButton>
      </HStack>

      {/* 조회수 상위 3개 데이터 표시 */}

      <div className="slider-container">
        <Slider
          autoplay={true} // 자동 슬라이드 활성화
          autoplaySpeed={3000} // 2.5초 단위로 슬라이드 변경
          dots={false} // 점 표시 활성화
          infinite={true} // 슬라이드가 무한히 반복되도록
          speed={1500}
        >
          <div>
            <Box
              mb={8}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              p={4}
            >
              <h3 style={{ color: "#0288d1" }}>조회수 Top 3</h3>
              <SimpleGrid columns={3} gap="20px" mt={4} dots:true>
                {topBoards.slice(0, 3).map((board) => (
                  <Card.Root
                    key={board.number}
                    width="200px"
                    style={{
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <Card.Body gap="2">
                      <Image
                        rounded="md"
                        src="https://bit.ly/dan-abramov"
                        alt="Dan Abramov"
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <HStack justifyContent="space-between" mt="1">
                        <Text fontSize="sm" color="#0288d1" noOfLines={1}>
                          {board.site}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          Views:{board.viewCount}
                        </Text>
                      </HStack>
                      <Card.Title
                        mt="2"
                        style={{ color: "#0288d1", fontSize: "14px" }}
                      >
                        {board.title}
                      </Card.Title>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                      <Button
                        variant="outline"
                        onClick={() => handleRowClick(board.number)}
                        style={{
                          backgroundColor: "#0288d1",
                          color: "white",
                          padding: "2px 6px",
                          borderRadius: "16px",
                          fontSize: "12px",
                        }}
                      >
                        View
                      </Button>
                    </Card.Footer>
                  </Card.Root>
                ))}
              </SimpleGrid>
            </Box>
          </div>
          <div>
            <Box
              mb={8}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              p={4}
            >
              {/*인기 게시글 top3*/}
              <h3 style={{ color: "#0288d1" }}>인기 게시글 Top 3</h3>
              <SimpleGrid columns={3} gap="20px" mt={4} dots:true>
                {likeTopBoards.slice(0, 3).map((board) => (
                  <Card.Root
                    key={board.number}
                    width="200px"
                    style={{
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      borderRadius: "8px",
                    }}
                  >
                    <Card.Body gap="2">
                      <Image
                        rounded="md"
                        src="https://via.placeholder.com/150"
                        alt={`게시글 ${board.number}`}
                        style={{
                          width: "100%",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <HStack justifyContent="space-between" mt="1">
                        <Text fontSize="sm" color="#0288d1" noOfLines={1}>
                          {board.site}
                        </Text>

                        <Text fontSize="sm" color="gray.500">
                          Like:
                          {
                            likeCount.find((l) => l.number == board.number)
                              .likeCount
                          }
                        </Text>
                      </HStack>
                      <Card.Title
                        mt="2"
                        style={{ color: "#0288d1", fontSize: "14px" }}
                      >
                        {board.title}
                      </Card.Title>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                      <Button
                        variant="outline"
                        onClick={() => handleRowClick(board.number)}
                        style={{
                          backgroundColor: "#0288d1",
                          color: "white",
                          padding: "2px 6px",
                          borderRadius: "16px",
                          fontSize: "12px",
                        }}
                      >
                        View
                      </Button>
                    </Card.Footer>
                  </Card.Root>
                ))}
              </SimpleGrid>
            </Box>
          </div>
        </Slider>
      </div>

      {/* 일반 게시물 목록 */}
      {isLoading ? (
        <Center h="50vh">
          <HStack gap="5">
            <Spinner size="xl" />
          </HStack>
        </Center>
      ) : errorMessage ? (
        <Alert
          title="Alert Title"
          icon={<LuTerminal />}
          status="error"
          style={{
            backgroundColor: "#ffcccc",
            color: "#900",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          데이터를 불러오는 데 실패하였습니다.
        </Alert>
      ) : boardList.length === 0 ? (
        <Center flexDirection="column" gap={2} mt="35px">
          <h2 style={{ color: "#0288d1" }}>해당 게시글이 없습니다.</h2>
          <Box as="p" fontSize="sm" color="gray.600" mt={2} textAlign="center">
            검색어를 수정하시거나, 다른 조건으로 검색해주세요.
          </Box>
        </Center>
      ) : (
        <Table.Root
          interactive
          style={{
            margin: "0 auto",
            width: "80%",
            borderCollapse: "collapse",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader
                style={{
                  padding: "8px",
                  backgroundColor: "#0288d1",
                  color: "white",
                  border: "1px solid #ddd",
                  textAlign: "center",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  width: "10%",
                }}
              >
                번호
              </Table.ColumnHeader>
              <Table.ColumnHeader
                style={{
                  padding: "8px",
                  backgroundColor: "#0288d1",
                  color: "white",
                  border: "1px solid #ddd",
                  textAlign: "center",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  width: "10%",
                }}
              >
                낚시 장소
              </Table.ColumnHeader>
              <Table.ColumnHeader
                style={{
                  padding: "8px",
                  backgroundColor: "#0288d1",
                  color: "white",
                  border: "1px solid #ddd",
                  textAlign: "center",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  width: "35%",
                }}
              >
                제목
              </Table.ColumnHeader>

              <Table.ColumnHeader
                style={{
                  padding: "8px",
                  backgroundColor: "#0288d1",
                  color: "white",
                  border: "1px solid #ddd",
                  textAlign: "center",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  width: "15%",
                }}
              >
                작성자
              </Table.ColumnHeader>
              <Table.ColumnHeader
                style={{
                  padding: "8px",
                  backgroundColor: "#0288d1",
                  color: "white",
                  border: "1px solid #ddd",
                  textAlign: "center",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  width: "10%",
                }}
              >
                조회수
              </Table.ColumnHeader>
              <Table.ColumnHeader
                style={{
                  padding: "8px",
                  backgroundColor: "#0288d1",
                  color: "white",
                  border: "1px solid #ddd",
                  textAlign: "center",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  width: "10%",
                }}
              >
                좋아요
              </Table.ColumnHeader>
              <Table.ColumnHeader
                style={{
                  padding: "8px",
                  backgroundColor: "#0288d1",
                  color: "white",
                  border: "1px solid #ddd",
                  textAlign: "center",
                  fontWeight: "bold",
                  borderRadius: "4px",
                  width: "10%",
                }}
              >
                작성일시
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {boardList.map((board) => (
              <Table.Row
                key={board.number}
                onClick={() => handleRowClick(board.number)} // 클릭 이벤트 핸들러
                cursor="pointer"
                _hover={{ backgroundColor: "#e0f7fa" }}
                style={{
                  transition: "background-color 0.2s ease",
                  padding: "8px",
                  border: "1px solid #ddd",
                }}
              >
                <Table.Cell
                  style={{
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {board.number}
                </Table.Cell>
                <Table.Cell
                  style={{
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {board.site}
                </Table.Cell>
                <Table.Cell
                  style={{
                    padding: "11px",
                    textAlign: "center",
                  }}
                >
                  {board.title.length > 20
                    ? `${board.title.slice(0, 20)}...`
                    : board.title}
                </Table.Cell>

                <Table.Cell
                  style={{
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {board.writer}
                </Table.Cell>
                <Table.Cell
                  style={{
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {board.viewCount}
                </Table.Cell>

                <Table.Cell
                  style={{
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {board.likeCount}
                </Table.Cell>

                <Table.Cell
                  style={{
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  {board.date}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}

      {/* 페이지네이션 */}
      <Box mt={5} mb={5}>
        <HStack spacing={10} justifyContent="space-between">
          {/* 페이지네이션 중앙 */}
          <HStack gap="4" justifyContent="center" flex="1" ml="150px">
            <PaginationRoot
              onPageChange={handlePageChange}
              count={count}
              pageSize={10}
              page={page}
            >
              <PaginationPrevTrigger />
              <PaginationItems />
              <PaginationNextTrigger />
            </PaginationRoot>
          </HStack>

          {/* 버튼 왼쪽 끝 */}
          <Flex justifyContent="flex-start" mr="115px">
            <Button
              variant="surface"
              onClick={handleWriteClick}
              style={{
                backgroundColor: "#0288d1",
                color: "white",
                padding: "8px 12px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                marginRight: "100px",
              }}
            >
              게시글 작성
            </Button>
          </Flex>
        </HStack>
      </Box>
    </Box>
  );
}
