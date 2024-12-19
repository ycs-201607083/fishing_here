package com.example.backend.mapper.comment;

import com.example.backend.dto.comment.Comment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO comment
            (board_id, member_id, comment)
            VALUES (#{boardId}, #{memberId}, #{comment})
            """)
    int insert(Comment comment);

    @Select("""
            SELECT *
            FROM comment
            WHERE board_id=#{boardId}
            ORDER BY id
            """)
    List<Comment> selectByBoardId(Integer boardId);

    @Select("""
            SELECT *
            FROM comment
            WHERE id = #{id}
            """)
    Comment selectById(Integer id);


    @Update("""
            UPDATE comment
            SET comment = #{comment}
            WHERE id = #{id}
            """)
    int updateComment(@Param("id") Integer id, @Param("comment") String comment);
    

    @Delete("""
                DELETE FROM comment
                WHERE board_id = #{id}
            """)
    int deleteCommentsByBoardId(Integer id);


    @Delete("""
                DELETE FROM board
                WHERE board_number = #{id}
            """)
    int deleteBoardById(Integer id);

}