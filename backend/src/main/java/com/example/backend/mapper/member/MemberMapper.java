package com.example.backend.mapper.member;

import com.example.backend.dto.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface MemberMapper {
    @Insert("""
            INSERT INTO member
            (member_id,
             member_email,
             member_password,
             member_phone,
             member_name,
             member_birth,
             member_post,
             member_address)
            VALUES (#{id},#{email},#{password},#{phone},#{name},#{birth},#{post},#{address})
            """)
    int insert(Member member);

    @Select("""
            SELECT *
            FROM member
            WHERE member_id = #{id}
            """)
    Member selectById(String id);
}
