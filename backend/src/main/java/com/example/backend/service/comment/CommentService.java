package com.example.backend.service.comment;

import com.example.backend.dto.comment.QuestionComment;
import com.example.backend.dto.comment.QuestionReComment;
import com.example.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {

    final CommentMapper mapper;

    public void quesAdd(QuestionComment comment, Authentication auth) {
        comment.setWriter(auth.getName());

        mapper.insertQues(comment);
    }

    public List<QuestionComment> quesCommList(Integer quesId) {
        return mapper.selectByQuesId(quesId);
    }

    public boolean hasQuesCommAccess(Integer id, Authentication auth) {
        QuestionComment comment = mapper.selectByQuesCommentId(id);

        return comment.getWriter().equals(auth.getName());
    }

    public boolean updateQuesComment(QuestionComment comment) {
        int cnt = mapper.updateQuesComment(comment);
        return cnt == 1;
    }

    public boolean removeQuesComment(Integer id) {
        int cnt = mapper.deleteQuesComment(id);
        return cnt == 1;
    }

    public Boolean reQuesAdd(QuestionReComment comment, Authentication auth) {
        comment.setWriter(auth.getName());

        int cnt = mapper.insertReQues(comment);
        return cnt == 1;
    }

    public List<QuestionReComment> quesReCommList(Integer quesId) {
        return mapper.selectByQuesIdReComment(quesId);
    }

    public boolean updateReQuesComment(QuestionReComment comment) {
        int cnt = mapper.updateReQuesComment(comment);
        return cnt == 1;
    }

    public boolean hasQuesReCommAccess(Integer id, Authentication auth) {
        QuestionComment comment = mapper.selectByQuesReCommentId(id);

        return comment.getWriter().equals(auth.getName());
    }

    public boolean removeReQuesComment(Integer id) {
        int cnt = mapper.deleteReQuesComment(id);
        return cnt == 1;
    }
}
