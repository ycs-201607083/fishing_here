package com.example.backend.dto.member;

import lombok.Data;

@Data
public class Member {
    private Integer number;
    private String id;
    private String email;
    private String password;
    private String phone;
    private String name;
    private String birth;
    private String post;
    private String address;
    private String inserted;
}
