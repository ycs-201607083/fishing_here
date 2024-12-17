package com.example.backend.controller.comment;

import com.example.backend.dto.comment.QuestionComment;
import com.example.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {

    final CommentService service;

    @PostMapping("quesAdd")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> quesAdd(@RequestBody QuestionComment comment, Authentication auth) {

        service.quesAdd(comment, auth);
        return ResponseEntity.ok(Map.of("message", Map.of("type", "success", "text", "댓글이 등록되었습니다.")));
    }
}
