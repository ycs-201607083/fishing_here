import { Box, Card, Flex, Spacer } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { useContext } from "react";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";

function QuesCommentItem({ comment, contentWriter }) {
  const { hasAccess, isAuthenticated, isAdmin } = useContext(
    AuthenticationContext,
  );
  const canViewComment =
    !comment.secret || hasAccess(contentWriter) || hasAccess(comment.writer);

  return (
    <Box pt={2}>
      <Card.Root>
        <Card.Header
          bgColor={"gray.100"}
          borderRadius={"6px 6px 0px 0px"}
          borderBottom="1px dashed #000"
          pt={2}
          pb={2}
        >
          <Card.Title>
            <Flex>
              <Box>{comment.writer}</Box>
              <Spacer />
              <Box fontSize={"12px"}>{comment.inserted}</Box>
            </Flex>
          </Card.Title>
        </Card.Header>
        <Card.Body pt={2}>
          {canViewComment ? (
            <Card.Description>{comment.comment}</Card.Description>
          ) : (
            <Card.Description>비밀 댓글입니다.</Card.Description>
          )}
        </Card.Body>
        <Card.Footer justifyContent="flex-end" mt={-10}>
          <Button colorPalette={"blue"} variant={"outline"} fontWeight={"bold"}>
            수정
          </Button>
          <Button colorPalette={"red"} variant={"outline"} fontWeight={"bold"}>
            삭제
          </Button>
        </Card.Footer>
      </Card.Root>
    </Box>
  );
}

export function QuesCommentList({ commentList, writer }) {
  return (
    <Box>
      {commentList.map((comment) => (
        <QuesCommentItem
          key={comment.id}
          comment={comment}
          contentWriter={writer}
        />
      ))}
    </Box>
  );
}
