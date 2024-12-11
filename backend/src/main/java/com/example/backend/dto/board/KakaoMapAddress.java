package com.example.backend.dto.board;

import lombok.Data;

@Data
public class KakaoMapAddress {
    private String addressName;
    private Double addressLat;
    private Double addressLng;
}
