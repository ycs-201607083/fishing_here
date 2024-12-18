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

    public boolean removeQuesComment(Integer comment) {
        int cnt = mapper.deleteQuesComment(comment);
        return true;
    }

    public Boolean reQuesAdd(QuestionReComment comment, Authentication auth) {
        comment.setWriter(auth.getName());

        int cnt = mapper.insertReQues(comment);
        return cnt == 1;
    }

    public List<QuestionReComment> quesReCommList(Integer quesId) {
        return mapper.selectByQuesIdReComment(quesId);
    }
}
