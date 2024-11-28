package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.mapper.board.BoardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardMapper mapper;

    public List<Board> searchlist(String field, String value) {
        return mapper.searchBoards(field, value);
    }

    public List<Board> list() {
        return mapper.selectAll();
    }
}