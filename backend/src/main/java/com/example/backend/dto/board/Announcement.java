package com.example.backend.dto.board;

import lombok.Data;

@Data
public class Announcement {
    private Integer id;
    private String title;
    private String content;
    private String writer;
    private String inserted;
}
