package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper mapper;

    public Map<String, Object> getAllBoards(String search, String type, String site, Integer page) {
        page = (page - 1) * 10;
        return Map.of("list", mapper.findAllBoards(search, type, site, page),
                "count", mapper.countAll());
    }

    public List<Board> getTopBoardsByViews() {
        return mapper.findTopBoardsByViews();
    }

    public void increaseViewCount(Integer number) {
        mapper.updateViewCount(number);
    }
}
