package com.example.backend.mapper.board;

import com.example.backend.dto.board.Board;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Select("""
            SELECT board_number AS number, board_title AS title, board_writer AS writer, board_view_count AS viewCount, board_date AS date
            FROM board
            ORDER BY board_date DESC
            """)
    List<Board> findAllBoards();
}