package com.example.backend.dto.comment;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Comment {
    private Integer id;
    private Integer boardId;
    private String memberId;
    private String comment;
    private LocalDateTime inserted;

    // 차트 데이터 추가
    private String chartLabel;
    private Integer chartValue;
}
