package com.example.backend.controller.member;

import com.example.backend.dto.member.Member;
import com.example.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping(value = "check", params = "id")
    public ResponseEntity<Map<String, Object>> checkId(@RequestParam String id) {

        if (id.trim().isEmpty()) {
            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "warning", "text", "아이디를 입력하세요."), "available", false));
        } else {
            if (service.checkId(id)) {
                //이미 있으면
                return ResponseEntity.ok().body(Map.of("message",
                        Map.of("type", "warning", "text", "이미 존재하는 아이디 입니다."), "available", false));

            } else {
                return ResponseEntity.ok().body(Map.of("message",
                        Map.of("type", "success", "text", "사용 가능한 아이디 입니다."), "available", true));
            }
        }
    }
}
