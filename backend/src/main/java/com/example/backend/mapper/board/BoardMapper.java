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
            ORDER BY board_number DESC
            """)
    List<Board> selectAll();


    @Select("""
                    <script>
                       SELECT board_number, board_title, board_writer, board_view_count, board_date
                         FROM board
                          WHERE
                            <trim prefixOverrides="OR">
                                <if test="field == 'all' or field == 'board_title'">
                                    title LIKE CONCAT('%', #{value}, '%')
                                </if>
                                <if test="field == 'all' or field == 'board_writer'">
                                     OR content LIKE CONCAT('%', #{value}, '%')
                                </if>
                               </trim>
                           ORDER BY id
                   </script>
            """)
    List<Board> searchBoards(String field, String value);
}

