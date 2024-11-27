package com.example.backend.controller.member;

import com.example.backend.dto.member.Member;
import com.example.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {
    final MemberService service;

    @PostMapping("signup")
    public Map<String, Objects> signup(@RequestBody Member member) {
        System.out.println("member = " + member);
        if (service.add(member)) {
            System.out.println("잘됨");
        }
        return null;
    }
}
