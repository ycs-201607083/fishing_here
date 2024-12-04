package com.example.backend.dto.board;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Board {
    private Integer number;
    private String title;
    private String content;
    private String writer;
    private Integer viewCount;
    private LocalDateTime date;
    private String site;//민물낚시, 바다낚시
}
