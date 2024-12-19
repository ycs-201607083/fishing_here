package com.example.backend.dto.chart;

import lombok.Data;

@Data
public class ChartData {
    private Integer id;
    private Integer boardId; // 게시물 ID
    private String label;    // 차트 라벨
    private Integer value;   // 차트 값
}