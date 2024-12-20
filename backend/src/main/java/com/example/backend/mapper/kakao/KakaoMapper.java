package com.example.backend.mapper.kakao;

import com.example.backend.dto.kakao.KakaoMember;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface KakaoMapper {

    @Insert("""
                INSERT INTO member (
                    member_id,
                    member_email,
                    member_password,
                    member_phone,
                    member_name,
                    member_birth,
                    member_post,
                    member_address
                )
                VALUES (
                    #{id}, 
                    #{email}, 
                    #{password}, 
                    #{phone}, 
                    #{name}, 
                    #{birth}, 
                    #{post}, 
                    #{address}
                )
            """)
    int insertKakaoLogin(KakaoMember kakaoMember);


    @Select("""
            SELECT *
            FROM member
            WHERE member_email=#{email}
            """)
    KakaoMember selectByEmail(String email);
}
