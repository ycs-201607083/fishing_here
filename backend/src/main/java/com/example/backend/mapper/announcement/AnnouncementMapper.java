package com.example.backend.mapper.announcement;

import com.example.backend.dto.board.Announcement;
import com.example.backend.dto.board.Question;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface AnnouncementMapper {
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

    @Select("""
            SELECT COUNT(*)
            FROM announcement
            """)
    int getAnnouncementCount();

    @Select("""
            SELECT id,title,writer,inserted
            FROM announcement
            ORDER BY id desc
            LIMIT #{offset},10;
            """)
    List<Announcement> selectAnnouncement(Integer offset);

    @Insert("""
            INSERT INTO announcement
            (title,content,writer)
            VALUES(#{title},#{content},#{writer})
            """)
    @Options(keyProperty = "id", useGeneratedKeys = true)
    int insertAnn(Announcement announcement);

    @Select("""
            SELECT *
            FROM announcement
            WHERE id = #{id}
            """)
    Announcement selectByAnnId(int id);

    @Insert("""
            INSERT INTO ann_file
            VALUES (#{id},#{fileName})
            """)
    int insertAnnFile(Integer id, String fileName);

    @Select("""
            SELECT name
            FROM ann_file
            WHERE id= #{id}
            """)
    List<String> selectFilesByAnnId(int id);

    @Delete("""
            DELETE FROM ann_file
            WHERE id = #{id}
            AND name=#{name}
            """)
    int deleteFileByAnnIdAndName(Integer id, String name);

    @Update("""
            UPDATE announcement
            SET title=#{title},
                content=#{content}
            WHERE id =#{id}
            """)
    int updateAnn(Announcement announcement);

    @Delete("""
            DELETE FROM ann_file
            WHERE id = #{id}
            """)
    int deleteFileByAnnId(int id);

    @Delete("""
            DELETE FROM announcement
            WHERE id =#{id}
            """)
    int deleteByAnnId(int id);
}
