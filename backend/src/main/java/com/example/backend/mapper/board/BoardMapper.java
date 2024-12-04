package com.example.backend.mapper.board;

import com.example.backend.dto.board.Board;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

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
                    board_date AS date,
                    board_content AS content,
                    board_site AS site
                FROM board
                WHERE 
                    <choose>
                        <when test="site == 'allSite'">
                            board_site IN ('민물낚시', '바다낚시')
                        </when>
                        <when test="site == 'riverSite'">
                            board_site = '민물낚시'
                        </when>
                        <when test="site == 'seaSite'">
                            board_site = '바다낚시'
                        </when>
                        <otherwise>
                            1=1-- site 값이 없을 경우 전체 검색
                        </otherwise>
                    </choose>
                            <if test="keyword != null and keyword != ''">
                              AND (  
                                <choose>
                                    <when test="type == 'title'">
                                        board_title LIKE CONCAT('%', #{keyword}, '%')
                                    </when>
                                    <when test="type == 'content'">
                                        board_content LIKE CONCAT('%', #{keyword}, '%')
                                    </when>
                                    <when test="type == 'writer'">
                                        board_writer LIKE CONCAT('%', #{keyword}, '%')
                                    </when>
                                    <otherwise>
                                        (board_title LIKE CONCAT('%', #{keyword}, '%') OR 
                                         board_content LIKE CONCAT('%', #{keyword}, '%') OR 
                                         board_writer LIKE CONCAT('%', #{keyword}, '%'))
                                    </otherwise>
                                </choose>
                                  )
                            </if>
                ORDER BY board_number DESC
                LIMIT #{offset}, 10        
                    </script>
            """)
    List<Board> findAllBoards(@Param("keyword") String keyword,
                              @Param("type") String type,
                              @Param("site") String site,
                              Integer offset);


    @Select("""
                SELECT
                    board_number AS number,
                    board_title AS title,
                    board_writer AS writer,
                    board_view_count AS viewCount,
                    board_date AS date,
                    board_content AS content,
                    board_site AS site
                FROM board
                ORDER BY board_view_count DESC
                LIMIT 3
            """)
    List<Board> findTopBoardsByViews();


    @Update("""
            UPDATE board
            SET board_view_count = board_view_count + 1
            WHERE board_number = #{board_number}
            """)
    void updateViewCount(@Param("number") Integer number);
}
