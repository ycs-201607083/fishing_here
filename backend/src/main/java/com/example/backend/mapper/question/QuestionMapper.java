package com.example.backend.mapper.question;

import com.example.backend.dto.board.Question;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface QuestionMapper {
    @Select("""
            SELECT *
            FROM question
            ORDER BY id DESC
            LIMIT #{offset},10
            """)
    List<Question> selectALlQuestion(int offset);

    @Select("""
            SELECT COUNT(*)
            FROM question
            """)
    int getQuestionCount();

    @Insert("""
            INSERT INTO question
            (title,content,writer)
            VALUES(#{title},#{content},#{writer})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertQues(Question question);

    @Insert("""
            INSERT INTO ques_file
            VALUES (#{id},#{fileName})
            """)
    int insertQuesFile(Integer id, String fileName);

    @Select("""
            SELECT *
            FROM question
            WHERE id = #{id}
            """)
    Question selectByQuesId(int id);

    @Select("""
            SELECT name
            FROM ques_file
            WHERE id = #{id}
            """)
    List<String> selectFilesByQuesId(int id);

    @Delete("""
            DELETE FROM ques_file
            WHERE id = #{id}
            AND name=#{name}
            """)
    int deleteFileByQuesIdAndName(Integer id, String name);

    @Update("""
            UPDATE question
            SET title=#{title},
                content=#{content}
            WHERE id =#{id}
            """)
    int updateQuestion(Question question);

    @Delete("""
            DELETE FROM ques_file
            WHERE id = #{id}
            """)
    int deleteFileByQuesId(int id);

    @Delete("""
            DELETE FROM question
            WHERE id =#{id}
            """)
    int deleteByQuesId(int id);
}
