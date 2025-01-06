package com.example.backend.controller.board;

import com.example.backend.dto.board.Announcement;
import com.example.backend.service.announcement.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

//공지사항 컨트롤러
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ann")
public class AnnouncementController {

    final AnnouncementService service;

    @GetMapping("announcement")
    public Map<String, Object> announcement(@RequestParam(value = "page", defaultValue = "1") Integer page) {
        return service.listAnnouncement(page);
    }


    @GetMapping("viewAnn/{id}")
    public Announcement announcementView(@PathVariable int id) {
        return service.getAnnView(id);
    }

    @PostMapping("annAdd")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> announcementAdd(
            Announcement announcement,
            @RequestParam(value = "files[]", required = false) MultipartFile[] files,
            Authentication auth) {

        if (service.validateAnn(announcement)) {
            if (service.addAnn(announcement, auth, files)) {
                System.out.println("announcement = " + announcement);
                return ResponseEntity.ok().body(
                        Map.of("message",
                                Map.of("type", "success", "text", announcement.getId() + "번 게시글이 등록되었습니다."),
                                "data", announcement));
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

    @PutMapping("updateAnn")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> updateAnn(Announcement announcement,
                                                         @RequestParam(value = "removeFiles[]", required = false) List<String> removeFiles,
                                                         @RequestParam(value = "uploadFiles[]", required = false) MultipartFile[] updateFiles,
                                                         Authentication auth) {

        if (service.hasAccessAnn(announcement.getId(), auth)) {
            if (service.validateAnn(announcement)) {
                if (service.updateAnn(announcement, removeFiles, updateFiles)) {
                    return ResponseEntity.ok()
                            .body(Map.of("message", Map.of("type", "success",
                                            "text", announcement.getId() + "번 게시물이 수정 되었습니다."),
                                    "data", announcement));
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

    @DeleteMapping("deleteAnn/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> deleteAnn(@PathVariable int id, Authentication auth) {
        if (service.hasAccessAnn(id, auth)) {
            if (service.removeAnn(id)) {
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
