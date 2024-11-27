package com.example.backend.controller.member;

import com.example.backend.dto.member.Member;
import com.example.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    final private MemberService service;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Member member) {
        String token = service.token(member);
        System.out.println("sdsdsd");
        System.out.println("ID: " + member.getId() + ", Password: " + member.getPassword());

        if (token != null) {
            return ResponseEntity.ok(token);
        }


        return ResponseEntity.ok("로그인 성공");

    }
}