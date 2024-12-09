package com.example.backend.dto.board;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class KakaoMapAddress {
    private int number;
    private String name;
    private double let;
    private double lng;
}
