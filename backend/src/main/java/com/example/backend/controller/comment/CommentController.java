package com.example.backend.controller.comment;

import com.example.backend.dto.comment.QuestionComment;
import com.example.backend.dto.comment.QuestionReComment;
import com.example.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {

    final CommentService service;

    @PostMapping("reQuesAdd")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> reQuesAdd(@RequestBody QuestionReComment comment, Authentication auth) {

        service.reQuesAdd(comment, auth);
        return ResponseEntity.ok(Map.of("message", Map.of("type", "success", "text", "댓글이 등록되었습니다.")));
    }

    @GetMapping("quesReCommentList/{quesId}")
    public List<QuestionReComment> questionReCommentList(@PathVariable Integer quesId) {
        return service.quesReCommList(quesId);
    }


    @PostMapping("quesAdd")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> quesAdd(@RequestBody QuestionComment comment, Authentication auth) {

        service.quesAdd(comment, auth);
        return ResponseEntity.ok(Map.of("message", Map.of("type", "success", "text", "댓글이 등록되었습니다.")));
    }

    @GetMapping("quesCommentList/{quesId}")
    public List<QuestionComment> quesCommentList(@PathVariable Integer quesId) {
        return service.quesCommList(quesId);
    }

    @PutMapping("quesEdit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> quesCommEdit(
            @RequestBody QuestionComment comment,
            Authentication auth) {

        if (service.hasQuesCommAccess(comment.getId(), auth)) {
            if (service.updateQuesComment(comment)) {
                return ResponseEntity.ok().body(Map.of("message",
                        Map.of("type", "success",
                                "text", "댓글이 수정되었습니다.")));
            } else {
                return ResponseEntity.internalServerError().body(Map.of("message",
                        Map.of("type", "error",
                                "text", "댓글이 수정되지 않았습니다.")));
            }
        } else {
            return ResponseEntity.internalServerError().body(
                    Map.of("message",
                            Map.of("type", "error", "text", "권한이 없습니다.")));
        }
    }

    @DeleteMapping("quesRemove/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> quesRemove(
            @PathVariable Integer id,
            Authentication auth) {

        if (service.hasQuesCommAccess(id, auth)) {
            if (service.removeQuesComment(id)) {
                return ResponseEntity.ok().body(Map.of("message",
                        Map.of("type", "success",
                                "text", "댓글이 삭제되었습니다.")));
            } else {
                return ResponseEntity.internalServerError().body(Map.of("message",
                        Map.of("type", "error",
                                "text", "댓글이 삭제되지 않았습니다.")));
            }
        } else {
            return ResponseEntity.internalServerError().body(
                    Map.of("message",
                            Map.of("type", "error", "text", "권한이 없습니다.")));
        }
    }
}
