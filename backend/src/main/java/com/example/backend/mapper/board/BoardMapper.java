package com.example.backend.mapper.board;

import com.example.backend.dto.board.Board;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Select("""
            SELECT board_number, board_title, board_writer, board_view_count, board_date
            FROM board
            ORDER BY board_date DESC
            """)
    List<Board> findAllBoards();
}