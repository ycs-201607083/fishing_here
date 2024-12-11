package com.example.backend.controller.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
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

    @PostMapping("login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Member member) {
        String token = service.token(member);

        if (token != null) {
            // 로그인 성공
            return ResponseEntity.ok(Map.of("token", token,
                    "message", Map.of("type", "success",
                            "text", "로그인 되었습니다.")));
        } else {
            // 로그인 실패
            return ResponseEntity.status(401)
                    .body(Map.of("message", Map.of("type", "warning",
                            "text", "아이디와 암호를 확인해주세요.")));
        }
    }

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

    @GetMapping("{id}")
    public Member getMember(@PathVariable String id) {
        return service.get(id);
    }

    @DeleteMapping("remove")
    public ResponseEntity<Map<String, Object>> remove(@RequestBody Member member) {
        if (service.remove(member)) {
            return ResponseEntity.ok(Map.of("message",
                    Map.of("type", "success",
                            "text", "회원정보를 삭제하였습니다.")));
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            Map.of("type", "warning",
                                    "text", "정확한 정보를 입력해주세요.")));
        }
    }

    @PutMapping("update")
    public ResponseEntity<Map<String, Object>> update(@RequestBody MemberEdit member) {
        if (service.update(member)) {
            //잘됨
            return ResponseEntity.ok(Map.of("message",
                    Map.of("type", "success",
                            "text", "회원정보를 수정하였습니다.")));
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            Map.of("type", "warning",
                                    "text", "정확한 정보를 입력해주세요.")));
        }
    }
}