package com.example.backend.service.kakao;

import com.example.backend.dto.kakao.KakaoMember;
import com.example.backend.mapper.kakao.KakaoMapper;
import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.HashMap;

@Transactional
@Service
@RequiredArgsConstructor
public class KakaoService {

    @Value("${kakao.token-uri}")
    private String tokenUrl;
    @Value("${kakao.redirect.url}")
    private String redirectUrl;
    @Value("${kakao.client.id}")
    private String clientId;
    @Value("${kakao.user-info-uri}")
    private String userInfoUri;
    @Value("${kakao.secret.key}")
    private String secretKey;

    final KakaoMapper mapper;

    public String getKakaoAccessToken(String code) {
        String accessToken = "";
        String refreshToken = "";
        String requestURL = tokenUrl;

        try {
            URL url = new URL(requestURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            //필수 헤더 세팅
            conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");
            conn.setDoOutput(true); //OutputStream으로 POST 데이터를 넘겨주겠다는 옵션.
            //post요청을 위해 기본값이 false인 setDoOutput을 true로 설정
            conn.setRequestProperty("Authorization", "Bearer " + code);     //전송할 header작성, accessToken전송

            //post요청에 필요로 요구하는 파라미터 스트림을 통해 전송
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream()));
            StringBuilder sb = new StringBuilder();

            sb.append("grant_type=authorization_code");
            sb.append("&client_id=" + clientId);
            sb.append("&redirect_uri=" + redirectUrl);
            sb.append("&code=" + code);
            bw.write(sb.toString());
            bw.flush();

            //결과 코드가 200이라면
            int responseCode = conn.getResponseCode();
            BufferedReader br;
            if (responseCode >= 200 && responseCode < 300) {
                br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            } else {
                br = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            }

            br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            StringBuilder responseSb = new StringBuilder();
            while ((line = br.readLine()) != null) {
                responseSb.append(line);
            }
            String result = responseSb.toString();

            JsonParser parser = new JsonParser();
            JsonElement element = parser.parse(result);
            accessToken = element.getAsJsonObject().get("access_token").getAsString();
            refreshToken = element.getAsJsonObject().get("refresh_token").getAsString();

            System.out.println("access_token : " + accessToken);
            System.out.println("refresh_token : " + refreshToken);

            br.close();
            bw.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        return accessToken;
    }

    public HashMap<String, Object> getUserInfo(String accessToken) {
        HashMap<String, Object> userInfo = new HashMap<>();
        String requestURL = userInfoUri; // 카카오 사용자 정보 API URL

        try {
            // HTTP 요청 설정
            URL url = new URL(requestURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET"); // GET 메서드로 요청
            conn.setRequestProperty("Authorization", "Bearer " + accessToken);
            conn.setRequestProperty("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

            // 응답 코드 확인
            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                System.out.println("Error: Response Code " + responseCode);
                return null; // 오류 발생 시 처리
            }

            BufferedReader br;
            if (responseCode >= 200 && responseCode <= 300) {
                br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            } else {
                br = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            }

            String line = "";
            StringBuilder responseSb = new StringBuilder();
            while ((line = br.readLine()) != null) {
                responseSb.append(line);
            }
            String result = responseSb.toString();

            JsonParser parser = new JsonParser();
            JsonElement element = parser.parse(result);

            JsonObject properties = element.getAsJsonObject().get("properties").getAsJsonObject();
            JsonObject kakaoAccount = element.getAsJsonObject().get("kakao_account").getAsJsonObject();

            String nickname = properties.getAsJsonObject().get("nickname").getAsString();
            String email = kakaoAccount.getAsJsonObject().get("email").getAsString();

            userInfo.put("nickname", nickname);
            userInfo.put("email", email);

            br.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
        return userInfo;
    }

    public boolean addKakao(KakaoMember kakaoMember) {
        int cnt = mapper.insertKakaoLogin(kakaoMember);

        return cnt == 1;
    }

    // 이메일이 존재하는지 확인
    public boolean checkEmailExists(String email) {
        KakaoMember kakaoMember = mapper.selectByEmail(email); // 이메일로 회원 조회
        return kakaoMember != null; // 존재하면 true 반환
    }

    public String createJwtToken(String kakaoToken) {
        // JWT 만료 시간을 설정 (예: 1시간)
        long expirationTime = 1000 * 60 * 60; // 1시간

        return Jwts.builder()
                .setSubject(kakaoToken) // 카카오 토큰을 subject로 설정
                .setIssuedAt(new Date()) // 발급 시간
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime)) // 만료 시간
                .signWith(SignatureAlgorithm.HS256, secretKey) // 비밀 키로 서명
                .compact();
    }
}
