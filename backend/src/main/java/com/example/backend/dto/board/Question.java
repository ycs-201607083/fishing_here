package com.example.backend.dto.board;

import lombok.Data;

import java.util.List;

@Data
public class Question {
    private Integer id;
    private String title;
    private String writer;
    private String content;
    private String inserted;

    private List<QuesFile> fileList;
}
