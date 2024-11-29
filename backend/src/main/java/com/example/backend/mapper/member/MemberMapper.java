package com.example.backend.mapper.member;

import com.example.backend.dto.member.Member;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface MemberMapper {

    @Select("""
            SELECT auth
            FROM auth
            WHERE auth_id = #{id}
            """)
    List<String> selectAuthByMemberId(String id);

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
            SELECT member_id id, member_password password
            FROM member
            WHERE member_id = #{id}
            """)
    Member selectById(String id);


    @Select("""
            SELECT member_id id, member_email email, member_inserted inserted
            from member
            ORDER BY id;
            """)
    List<Member> selectAll();
}
