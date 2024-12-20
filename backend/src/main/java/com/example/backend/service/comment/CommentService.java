package com.example.backend.service.comment;

import com.example.backend.dto.comment.Comment;
import com.example.backend.dto.comment.QuestionComment;
import com.example.backend.dto.comment.QuestionReComment;
import com.example.backend.mapper.comment.CommentMapper;
import com.example.backend.mapper.comment.QuestionCommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {

    final QuestionCommentMapper quesMapper;
    final CommentMapper mapper;

    public void quesAdd(QuestionComment comment, Authentication auth) {
        comment.setWriter(auth.getName());

        quesMapper.insertQues(comment);
    }

    public List<QuestionComment> quesCommList(Integer quesId) {
        return quesMapper.selectByQuesId(quesId);
    }

    public boolean hasQuesCommAccess(Integer id, Authentication auth) {
        QuestionComment comment = quesMapper.selectByQuesCommentId(id);

        return comment.getWriter().equals(auth.getName());
    }

    public boolean updateQuesComment(QuestionComment comment) {
        int cnt = quesMapper.updateQuesComment(comment);
        return cnt == 1;
    }

    public boolean removeQuesComment(Integer id) {
        quesMapper.deleteChildComment(id);
        int cnt = quesMapper.deleteQuesComment(id);
        return cnt == 1;
    }

    public Boolean reQuesAdd(QuestionReComment comment, Authentication auth) {
        comment.setWriter(auth.getName());

        int cnt = quesMapper.insertReQues(comment);
        return cnt == 1;
    }

    public List<QuestionReComment> quesReCommList(Integer quesId) {
        return quesMapper.selectByQuesIdReComment(quesId);
    }

    public boolean updateReQuesComment(QuestionReComment comment) {
        int cnt = quesMapper.updateReQuesComment(comment);
        return cnt == 1;
    }

    public boolean hasQuesReCommAccess(Integer id, Authentication auth) {
        QuestionComment comment = quesMapper.selectByQuesReCommentId(id);

        return comment.getWriter().equals(auth.getName());
    }

    public boolean removeReQuesComment(Integer id) {
        int cnt = quesMapper.deleteReQuesComment(id);
        return cnt == 1;
    }

    public void add(Comment comment, Authentication auth) {
        comment.setMemberId(auth.getName());

        mapper.insert(comment);
    }

    public List<Comment> list(Integer boardId) {
        return mapper.selectByBoardId(boardId);
    }

    public boolean hasAccess(Integer id, Authentication auth) {
        Comment comment = mapper.selectById(id); // 댓글 조회
        return comment != null && comment.getMemberId().equals(auth.getName()); // 작성자 확인
    }

    public void remove(Integer id) {
        mapper.deleteCommentById(id);
    }

    public void edit(Integer id, String commentContent) {
        mapper.updateComment(id, commentContent);
    }
}
