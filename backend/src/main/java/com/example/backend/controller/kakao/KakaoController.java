package com.example.backend.controller.kakao;

import com.example.backend.service.kakao.KakaoService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@RestController
//@RequestMapping("/api/kakao")
public class KakaoController {

    @Value("${kakao.client.id}")
    private String kakaoClientId;
    @Value("${kakao.redirect.url}")
    private String kakaoRedirectUrl;
    @Value("${kakao.token-uri}")
    private String kakaoTokenUri;
    @Value("${kakao.user-info-uri}")
    private String kakaoUserInfoUri;

    private final KakaoService kakaoService;


    @GetMapping("/api/oauth/kakao")
    public ResponseEntity<?> kakaoLogin(
            @RequestParam("code") String code,
            HttpSession session) {
        String accessToken = kakaoService.getKakaoAccessToken(code);
        HashMap<String, Object> userInfo = kakaoService.getUserInfo(accessToken);
        HashMap<String, Object> response = new HashMap<>();
        System.out.println("userInfo = " + userInfo);
        System.out.println("인가코드 = " + code);
        System.out.println("accessToken = " + accessToken);

        //클라이언트의 이메일이 존재할 때 세션에 대한 해당 이메일과 토큰 등록
       /* if (userInfo.get("nickname") != null) {
            session.setAttribute("userId", userInfo.get("email"));
            session.setAttribute("access_Token", accessToken);
        }*/


        return ResponseEntity.ok(Map.of("token", accessToken)); // JSON 형태로 응답response;
    }
}