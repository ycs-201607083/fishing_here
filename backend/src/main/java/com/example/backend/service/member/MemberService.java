package com.example.backend.service.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import com.example.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
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
    private final JwtEncoder jwtEncoder;

    public boolean add(Member member) {
        int cnt = mapper.insert(member);

        return cnt == 1;
    }

    public boolean checkId(String id) {
        return mapper.selectById(id) != null;
    }

    public String token(Member member) {
        Member db = mapper.selectById(member.getId());
        List<String> auths = mapper.selectAuthByMemberId(member.getId());
        System.out.println("Auths: " + auths);
        String authsString = auths.stream()
                .collect(Collectors.joining(" "));

        if (db != null) {
            if (db.getPassword().equals(member.getPassword())) {
                // token 만들어서 리턴
                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .subject(member.getId())
                        .issuedAt(Instant.now())
                        .expiresAt(Instant.now().plusSeconds(60 * 60 * 24 * 7))
                        .claim("scope", authsString)
                        .build();

                return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
            }
        }

        return null;
    }

    public Member get(String id) {
        return mapper.infoId(id);
    }

    public boolean remove(Member member) {
        int cnt = 0;
        // 기존 암호와 비교
        Member db = mapper.selectById(member.getId());
        if (db != null) {
            if (db.getPassword().equals(member.getPassword())) {
                cnt = mapper.deleteById(member.getId());
            }
        }
        return cnt == 1;

    }

    public boolean update(MemberEdit memberEdit) {
        int cnt = 0;
        Member db = mapper.selectById(memberEdit.getId());
        if (db != null) {
            if (db.getPassword().equals(memberEdit.getOldPassword())) {
                cnt = mapper.update(memberEdit);
            }
        }
        return cnt == 1;
    }
}
