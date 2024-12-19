package com.example.backend.mapper.board;

import com.example.backend.dto.board.Announcement;
import com.example.backend.dto.board.Board;
import com.example.backend.dto.board.FishingAddress;
import com.example.backend.dto.board.KakaoMapAddress;
import org.apache.ibatis.annotations.*;

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
                <script>
                SELECT COUNT(*) 
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
                </script>
            """)
        // 검색 조건에 따른 게시글 개수를 반환
    Integer countBoardsBySearch(@Param("keyword") String keyword,
                                @Param("type") String type,
                                @Param("site") String site);


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
            WHERE board_number = #{number}
            """)
    void updateViewCount(@Param("number") Integer number);

    @Select("""
            SELECT COUNT(*) FROM board
            """)
    Integer countAll();

    @Insert("""
                    INSERT INTO board
                    (board_title, board_content, board_writer, board_site)
                    VALUES (#{title}, #{content}, #{writer}, #{site})
            """)
    @Options(keyProperty = "number", useGeneratedKeys = true)
    int insert(Board board);

    @Insert("""
                    INSERT INTO board_file
                    VALUES (#{id}, #{fileName});
            """)
    void insertFile(Integer id, String fileName);

    @Select("""
                        SELECT 
                        board_number number,
                        board_title title, 
                        board_writer writer, 
                        board_date AS date,
                        board_content content,
                        board_site site,
                        board_view_count viewCount
                                    FROM board
                                    WHERE board_number = #{number}
            """)
    Board selectById(int number);

    @Select("""
              SELECT 
                        board_number number,
                        board_title title, 
                        board_writer writer, 
                        board_date AS date,
                        board_content content,
                        board_site site,
                        board_view_count viewCount
                FROM board
                  WHERE board_number IN (
                    SELECT board_id
                      FROM (
                              SELECT board_id
                              FROM board_like
                              GROUP BY board_id
                              ORDER BY COUNT(board_id) DESC
                              LIMIT 3
                           ) AS top_boards
                       );
            """)
    List<Board> findTopBoardsByLike();

    @Select("""
               SELECT board_id AS number, COUNT(board_id) AS likeCount
               FROM board_like
               GROUP BY board_id
               ORDER BY likeCount DESC
            """)
    List<Board> findLikeCount();

    @Select("""
            SELECT name 
            FROM board_file
            WHERE board_id = #{number}
            """)
    List<String> selectFilesByBoardId(int number);

    @Delete("""
                    DELETE
                    FROM board
                    WHERE board_number = #{number}
            """)
    int deleteById(int number);


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

    @Select("""
            SELECT name
            FROM ann_file
            WHERE id=#{id}
            LIMIT 1
            """)
    List<String> selectFilesByAnnIdBanner(Integer id);

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

    @Select("""
            SELECT id, title
            FROM announcement
            ORDER BY inserted DESC
            LIMIT 5;
            """)
    List<Announcement> selectAllAnn();


    @Select("""
                   SELECT addr_name addressName, addr_lng addressLng, addr_lat addressLat
                   FROM fishing_addr
                   WHERE board_number = #{number}
            """)
    KakaoMapAddress getKakaoAddress(int number);

    @Delete("""
                    DELETE FROM board_file
                    WHERE board_id = #{number}
                    AND name = #{name}
            """)
    void deleteFileByBoardIdAndName(Integer number, String name);

    @Update("""
                    UPDATE board
                    SET board_title = #{title}, board_content = #{content}, board_site=#{site}
                    WHERE board_number=#{number}
            """)
    int update(Board board);

    @Insert("""
                INSERT INTO fishing_addr
                ( addr_name, addr_lng, addr_lat, board_number)
                VALUES (#{addressName}, #{addressLng}, #{addressLat}, #{boardNumber})
            """)
    void insertKakaoAddr(String addressName, Double addressLng, Double addressLat, int boardNumber);

    @Update("""
                    UPDATE fishing_addr
                    SET addr_name = #{addressName}, addr_lng = #{addressLng}, addr_lat = #{addressLat}
                    WHERE board_number=#{boardNumber}
            """)
    void updateKakaoAddr(String addressName, Double addressLng, Double addressLat, int boardNumber);

    @Select("""
                SELECT board_number AS number,
                       addr_name AS name,
                       addr_lng AS lng,
                       addr_lat AS lat
                FROM fishing_addr
                WHERE addr_lng IS NOT NULL AND addr_lat IS NOT NULL
                ORDER BY board_number DESC
            """)
    List<FishingAddress> selectFishAddress();

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
            WHERE member_id = #{id}
            """)
    List<Board> findBoardsByMemberId(String id);


}
