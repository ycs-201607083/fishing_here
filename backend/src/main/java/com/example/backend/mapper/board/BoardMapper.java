package com.example.backend.mapper.board;

import com.example.backend.dto.board.Board;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardMapper {

    @Select("""
            <script>
            SELECT 
                board_number AS number, 
                board_title AS title, 
                board_writer AS writer, 
                board_view_count AS viewCount, 
                board_date AS date
            FROM board
            WHERE 
                <choose>
                    <when test="type == 'title'">
                        board_title LIKE CONCAT('%', #{keyword}, '%') -- 제목 검색
                    </when>
                    <when test="type == 'content'">
                        board_content LIKE CONCAT('%', #{keyword}, '%') -- 본문 검색
                    </when>
                    <when test="type == 'writer'">
                        board_writer LIKE CONCAT('%', #{keyword}, '%') -- 작성자 검색
                    </when>
                    <otherwise>
                        (board_title LIKE CONCAT('%', #{keyword}, '%') -- 전체 검색
                        OR board_content LIKE CONCAT('%', #{keyword}, '%')
                        OR board_writer LIKE CONCAT('%', #{keyword}, '%'))
                    </otherwise>
                </choose>
            ORDER BY board_number DESC
            </script>
            """)
    List<Board> findAllBoards(@Param("keyword") String keyword, @Param("type") String type); // @Param 어노테이션으로 명시적 바인딩
}
