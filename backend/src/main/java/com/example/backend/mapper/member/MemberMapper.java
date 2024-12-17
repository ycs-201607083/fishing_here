package com.example.backend.mapper.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import org.apache.ibatis.annotations.*;

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
            SELECT member_id id,
             member_email email,
             member_password password,
             member_phone phone,
             member_name name,
             member_birth birth,
             member_post post,
             member_address address,
            member_inserted inserted
            FROM member
            WHERE member_id = #{id}
            """)
    Member infoId(String id);

    @Delete("""
            DELETE FROM member
            WHERE member_id = #{id}
            """)
    int deleteById(String id);

    @Update("""
            UPDATE member
            SET member_password=#{password},
                member_email= #{email},
                member_phone = #{phone},
                member_post = #{post},
                member_address= #{address}
            WHERE member_id=#{id}
            """)
    int update(MemberEdit memberEdit);
}
