package com.example.backend.controller.kakao;

import com.example.backend.dto.kakao.KakaoMember;
import com.example.backend.service.kakao.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member/kakao")
public class KakaoSignupController {
    final KakaoService service;

    @PostMapping("signup")
    public Map<String, Object> kakaoSignup(@RequestBody KakaoMember kakaoMember) {
        System.out.println("kakaoMemeber" + kakaoMember);
        if (service.addKakao(kakaoMember)) {
            System.out.println("카카오 로그인 성공");
        }

        return null;
    }
}
