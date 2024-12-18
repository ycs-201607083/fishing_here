package com.example.backend.service.comment;

import com.example.backend.dto.comment.Comment;
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

    public void add(Comment comment, Authentication auth) {
        comment.setMemberId(auth.getName());

        mapper.insert(comment);
    }

    public List<Comment> list(Integer boardId) {
        return mapper.selectByBoardId(boardId);
    }

    public boolean hasAccess(Integer id, Authentication auth) {
        Comment comment = mapper.selectById(id);
        return comment.getMemberId().equals(auth.getName());
    }

    public void remove(Integer id) {
        mapper.deleteById(id);
    }

    public void edit(Integer id, String commentContent) {
        mapper.updateComment(id, commentContent);
    }
}