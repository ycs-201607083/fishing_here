package com.example.backend.mapper.comment;

import com.example.backend.dto.comment.QuestionComment;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

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
}
