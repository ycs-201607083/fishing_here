package com.example.backend.service.kakao;

import com.nimbusds.jose.shaded.gson.JsonElement;
import com.nimbusds.jose.shaded.gson.JsonObject;
import com.nimbusds.jose.shaded.gson.JsonParser;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
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

    public String getKakaoAccessToken(String code) {
        String accessToken = "";
        String refreshToken = "";
        String requestURL = tokenUrl;

        try {
            URL url = new URL(requestURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            //post요청을 위해 기본값이 false인 setDoOutput을 true로 설정
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
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
            if (responseCode != 200) {
                System.out.println("Error: Response Code " + responseCode);
                return null; // 오류 발생 시 처리
            }

            
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            String line = "";
            String result = "";

            while ((line = br.readLine()) != null) {
                result += line;
            }
            System.out.println("response body : " + result);

            //Gson 라이브러리에 포함된 클래스로 JSON파싱 객체 생성
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

            // 응답 코드 확인
            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                System.out.println("Error: Response Code " + responseCode);
                return null; // 오류 발생 시 처리
            }

            // 응답 읽기
            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = br.readLine()) != null) {
                result.append(line);
            }

            // 응답 디버깅 출력
            System.out.println("Response body: " + result);

            // JSON 파싱
            JsonParser parser = new JsonParser();
            JsonObject element = parser.parse(result.toString()).getAsJsonObject();

            // JSON 데이터에서 필요한 값 추출
            JsonObject properties = element.has("properties") ? element.getAsJsonObject("properties") : null;
            JsonObject kakaoAccount = element.has("kakao_account") ? element.getAsJsonObject("kakao_account") : null;

            // 닉네임 추출 (null 안전 처리)
            if (properties != null && properties.has("nickname") && !properties.get("nickname").isJsonNull()) {
                userInfo.put("nickname", properties.get("nickname").getAsString());
            } else {
                userInfo.put("nickname", "Unknown"); // 기본값 설정
            }

            // 이메일 추출 (null 안전 처리)
            if (kakaoAccount != null && kakaoAccount.has("email") && !kakaoAccount.get("email").isJsonNull()) {
                userInfo.put("email", kakaoAccount.get("email").getAsString());
            } else {
                userInfo.put("email", "No Email"); // 기본값 설정
            }

        } catch (IOException e) {
            e.printStackTrace();
        }

        return userInfo;
    }

}
