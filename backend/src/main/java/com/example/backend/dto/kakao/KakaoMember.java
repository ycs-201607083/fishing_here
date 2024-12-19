package com.example.backend.dto.kakao;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KakaoMember {
    private String phone;
    private String email;
    private String password;
    private String id;
    private String name;
    private String birth;
    private String address;
    private int post;
}
