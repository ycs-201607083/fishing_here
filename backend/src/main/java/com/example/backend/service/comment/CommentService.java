package com.example.backend.service.comment;

import com.example.backend.dto.comment.QuestionComment;
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
}
