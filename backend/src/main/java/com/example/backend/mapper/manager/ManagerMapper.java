package com.example.backend.mapper.manager;

import com.example.backend.dto.board.Board;
import com.example.backend.dto.member.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ManagerMapper {

    @Select("""
            SELECT member_id id, member_email email, member_point point, member_inserted inserted
            from member
            ORDER BY id;
            """)
    List<Member> selectMemberAll();

    @Select("""
                    SELECT board_number number, board_title title, board_writer writer, board_date date, board_site site
                    from board
                    ORDER BY board_number;
            """)
    List<Board> selectBoardAll();
}
