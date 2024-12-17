package com.example.backend.dto.comment;

import lombok.Data;

@Data
public class QuestionComment {
    private Integer id;
    private Integer board_Id;
    private String writer;
    private boolean secret;
    private String inserted;
}
