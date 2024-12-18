import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import * as PropTypes from "prop-types";
import { CommentItem } from "./CommentItem.jsx";

CommentItem.propTypes = { comment: PropTypes.any };

export function CommentList({ boardId }) {
  const [commentList, setCommentList] = useState([]);
  useEffect(() => {
    axios
      .get(`/api/comment/list/${boardId}`)
      .then((res) => res.data)
      .then((data) => setCommentList(data));
  }, []);
  return (
    <Box>
      {commentList.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </Box>
  );
}
