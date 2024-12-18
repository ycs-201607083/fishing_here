import { Box, Stack } from "@chakra-ui/react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";

export function CommentContainer({ boardId }) {
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/comment/list/${boardId}`)
      .then((res) => res.data)
      .then((data) => setCommentList(data));
  }, []);

  function handleSaveClick(comment) {
    axios.post("/api/comment/add", {
      boardId: boardId,
      comment: comment,
    });
  }

  return (
    <Box>
      <Stack gap={5}>
        <h3>댓글</h3>
        <CommentInput boardId={boardId} onSaveClick={handleSaveClick} />
        <CommentList boardId={boardId} commentList={commentList} />
      </Stack>
    </Box>
  );
}
