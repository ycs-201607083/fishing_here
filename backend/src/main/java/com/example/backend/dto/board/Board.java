package com.example.backend.dto.board;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Board {
    private Integer number;
    private Integer tagNumber;
    private String title;
    private String writer;
    private Integer viewCount;
    private LocalDateTime date;
    private String content;
}
