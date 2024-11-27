package com.example.backend.service.member;

import com.example.backend.dto.member.Member;
import com.example.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    final private MemberMapper mapper;
    private final JwtDecoder jwtDecoder;
    private final JwtEncoder jwtEncoder;

    public String token(Member member) {
        Member db = mapper.selectById(member.getId());
        List<String> auths = mapper.selectAuthByMember(member.getId());
        String authString = auths.stream()
                .collect(Collectors.joining(" "));

        if (db != null) {
            if (db.getPassword().equals(member.getPassword())) {
                //token 만든 후 리턴
                JwtClaimsSet claims =
                        JwtClaimsSet
                                .builder()
                                .issuer("self")
                                .subject(member.getId())
                                .issuedAt(Instant.now())
                                .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7))
                                .claim("scope", authString)
                                .build();

                return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
            }
        }
        return null;
    }
}
