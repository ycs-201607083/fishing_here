package com.example.backend.controller.board;

import com.example.backend.dto.board.Board;
import com.example.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("list")
    public List<Board> searchBoards(@RequestParam(value = "keyword", defaultValue = "") String search,
                                    @RequestParam(value = "type", defaultValue = "all") String type,
                                    @RequestParam(value = "site", defaultValue = "allSite") String site,
                                    @RequestParam(value = "page", defaultValue = "1") Integer page
    ) {
        return service.getAllBoards(search, type, site, page);
    }

    @GetMapping("/top-views")
    public List<Board> getTopBoardsByViews() {
        return service.getTopBoardsByViews();
    }

    @PostMapping("/view/{number}")
    public void increaseViewCount(@PathVariable Integer number) {
        service.increaseViewCount(number);
    }


}
