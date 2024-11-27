package com.example.backend.mapper.member;

import com.example.backend.dto.member.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Select("""
                    SELECT *
                    FROM member
                    WHERE id = #{id}
            """)
    Member selectById(String id);


    @Select("""
                SELECT auth
                FROM auth
                WHERE member_id = #{id}
            """)
    List<String> selectAuthByMember(String id);
}
