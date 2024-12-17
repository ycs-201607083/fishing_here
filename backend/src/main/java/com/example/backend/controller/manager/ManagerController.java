package com.example.backend.controller.manager;

import com.example.backend.dto.board.Board;
import com.example.backend.dto.manager.ManagerDto;
import com.example.backend.dto.member.Member;
import com.example.backend.service.manager.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/manager")
public class ManagerController {
    final ManagerService service;

    @GetMapping("list")
    public ManagerDto memberList() {
        List<Member> memberList = service.memberList();
        List<Board> boardList = service.boardList();

        return new ManagerDto(memberList, boardList);

    }

    @DeleteMapping("removeMember/{id}")
    public ResponseEntity<String> removeMember(@PathVariable String id) {
        try {
            boolean isDeleted = service.removeMember(id);
            if (isDeleted) {
                return ResponseEntity.ok("멤버가 삭제되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("멤버를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }

    @DeleteMapping("removeBoard/{number}")
    public ResponseEntity<String> removeBoard(@PathVariable int number) {
        try {
            boolean isDeleted = service.removeBoard(number);
            if (isDeleted) {
                return ResponseEntity.ok("멤버가 삭제되었습니다.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("멤버를 찾을 수 없습니다.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
        }
    }
}
