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
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {

    final BoardService service;

    @GetMapping("boardMain")
    public List<String> boardMain() {

        return null;
    }
    @GetMapping("/list")
    public List<Board> searchBoards(@RequestParam(value = "keyword", defaultValue = "") String search,
                                    @RequestParam(value = "type", defaultValue = "all") String type,
                                    @RequestParam(value = "site", defaultValue = "allSite") String site
    ) {
        return service.getAllBoards(search, type, site);
    }

}
