package com.example.backend.controller.kakao;

import com.example.backend.service.kakao.KakaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
public class KakaoController {
    private final KakaoService service;


    @GetMapping("/api/oauth/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestParam("code") String code) {
        // 카카오 토큰 받기
        String accessToken = service.getKakaoAccessToken(code);
        // 사용자 정보 받기
        HashMap<String, Object> userInfo = service.getUserInfo(accessToken);

        String email = (String) userInfo.get("email");
        String nickname = (String) userInfo.get("nickname");

        System.out.println("email = " + email);
        System.out.println("nickname = " + nickname);
        System.out.println("accessToken = " + accessToken);

        return ResponseEntity.ok(Map.of("kakaoToken", accessToken)); // JSON 형태로 응답
    }

//    @PostMapping("/api/oauth/kakao")
//    public ResponseEntity<?> kakaoLoginPost(@RequestBody Map<String, String> request) {
//        String kakaoToken = request.get("kakaoToken");
//
//        // 여기에 카카오 토큰을 사용하여 JWT 발급
//        String jwtToken = service.createJwtToken(kakaoToken);
//
//        return ResponseEntity.ok(Map.of("jwtToken", jwtToken)); // 발급된 JWT 반환
//    }


    @GetMapping("/api/kakao/check-email")
    public ResponseEntity<?> checkEmail(
            @RequestParam("email") String email,
            @RequestParam("accessToken") String accessToken) {
        //이메일을 사용하여 기존 회원 여부 확인
        boolean isExistingMember = service.checkEmailExists(email);

        if (isExistingMember) {
            //기존 회원이면 로그인
            return ResponseEntity.ok(Map.of("kakaoToken", accessToken, "message", "로그인 성공"));
        } else {
            // 신규 회원이면 회원가입 처리 (카카오 회원가입 페이지로 이동)
            return ResponseEntity.ok(Map.of("kakaoToken", accessToken, "message", "회원가입 필요"));
        }
    }
}