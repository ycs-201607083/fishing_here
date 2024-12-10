package com.example.backend.dto.board;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Announcement {
    private Integer id;
    private String title;
    private String content;
    private String writer;
    private LocalDateTime inserted;
}
