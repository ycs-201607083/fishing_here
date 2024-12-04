package com.example.backend.controller.manager;

import com.example.backend.dto.board.Board;
import com.example.backend.dto.manager.ManagerDto;
import com.example.backend.dto.member.Member;
import com.example.backend.service.manager.ManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ManagerController {
    final ManagerService service;

    @GetMapping("list")
    public ManagerDto memberList() {
        List<Member> memberList = service.memberList();
        List<Board> boardList = service.boardList();

        return new ManagerDto(memberList, boardList);

    }
}
