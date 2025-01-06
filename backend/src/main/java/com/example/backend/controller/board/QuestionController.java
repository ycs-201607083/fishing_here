package com.example.backend.controller.board;

import com.example.backend.dto.board.Question;
import com.example.backend.service.Question.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ques")
public class QuestionController {

    final QuestionService service;

    @GetMapping("question")
    public Map<String, Object> divide(@RequestParam(value = "page", defaultValue = "1") Integer page) {
        return service.listQuestion(page);
    }

    @PostMapping("questionAdd")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> questionAdd(
            Question question,
            @RequestParam(value = "files[]", required = false) MultipartFile[] files,
            Authentication auth) {

        if (service.validateQues(question)) {
            if (service.addQues(question, auth, files)) {
                return ResponseEntity.ok().body(
                        Map.of("message",
                                Map.of("type", "success", "text", question.getId() + "번 게시글이 등록되었습니다."),
                                "data", question));
            } else {
                return ResponseEntity.internalServerError().body(
                        Map.of("message",
                                Map.of("type", "warning", "text", "등록되지 않았습니다..")));
            }

        } else {
            return ResponseEntity.badRequest().body(
                    Map.of("message",
                            Map.of("type", "warning", "text", "제목과 본문을  입력해주세요.")));
        }
    }

    @GetMapping("questionView/{id}")
    public Question questionView(@PathVariable int id) {
        return service.getQuesView(id);
    }

    @PutMapping("updateQuestion")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> updateQuestion(Question question,
                                                              @RequestParam(value = "removeFiles[]", required = false) List<String> removeFiles,
                                                              @RequestParam(value = "uploadFiles[]", required = false) MultipartFile[] updateFiles,
                                                              Authentication auth) {

        if (service.hasAccessQues(question.getId(), auth)) {
            if (service.validateQues(question)) {
                if (service.updateQues(question, removeFiles, updateFiles)) {
                    return ResponseEntity.ok()
                            .body(Map.of("message", Map.of("type", "success",
                                            "text", question.getId() + "번 게시물이 수정 되었습니다."),
                                    "data", question));
                } else {
                    return ResponseEntity.internalServerError()
                            .body(Map.of("message", Map.of("type", "error",
                                    "text", "게시글이 수정되지 않았습니다.")));
                }
            } else {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", Map.of("type", "error",
                                "text", "제목이나 본문이 비어있습니다.")));
            }

        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error"
                            , "text", "수정 권한이 없습니다.")));
        }
    }

    @DeleteMapping("deleteQues/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> deleteQuestion(@PathVariable int id, Authentication auth) {
        if (service.hasAccessQues(id, auth)) {
            if (service.removeQues(id)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success",
                                "text", id + "번 게시물이 삭제 되었습니다.")));

            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "error",
                                "text", "게시물이 삭제 되지 않았습니다.")));
            }
        } else {
            return ResponseEntity.status(403)
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "권한이 없습니다.")));
        }
    }
}
