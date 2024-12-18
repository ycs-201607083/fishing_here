package com.example.backend.mapper.comment;

import com.example.backend.dto.comment.QuestionComment;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CommentMapper {
    @Insert("""
            INSERT INTO questionComment
            (ques_id,writer,comment,secret)
            VALUES(#{quesId},#{writer},#{comment},#{secret})
            """)
    int insertQues(QuestionComment comment);

    @Select("""
            SELECT *
            FROM questionComment
            WHERE ques_id=#{quesId}
            ORDER BY id
            """)
    List<QuestionComment> selectByQuesId(Integer quesId);

    @Select("""
            SELECT *
            FROM questionComment
            WHERE id=#{id}
            """)
    QuestionComment selectByQuesCommentId(Integer id);

    @Update("""
            UPDATE questionComment
            SET comment=#{comment}
            WHERE id= #{id}
            """)
    int updateQuesComment(QuestionComment comment);

    @Delete("""
            DELETE FROM questionComment
            WHERE id = #{id}
            """)
    int deleteQuesComment(Integer id);
}
