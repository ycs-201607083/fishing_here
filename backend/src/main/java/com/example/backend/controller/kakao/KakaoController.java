package com.example.backend.controller.kakao;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RequestMapping("/")
@RestController
public class KakaoController {
    @GetMapping("/auth")
    public void kakaoLogin(@RequestParam String auth) {
        System.out.println("hi");
    }
}
