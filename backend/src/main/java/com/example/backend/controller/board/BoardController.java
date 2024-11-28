package com.example.backend.controller.board;

import com.example.backend.dto.board.Board;
import com.example.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/board")
public class BoardController {

    private final BoardService service;

    @GetMapping("/list")
    public List<Board> list() {
        return service.list();
    }

    @GetMapping("/list")
    public List<Board> listSerch(
            @RequestParam(required = false) String field,
            @RequestParam(required = false) String value
    ) {
        return service.searchlist(field, value);
    }
}