package com.example.backend.dto.comment;

import lombok.Data;

@Data
public class QuestionComment {
    private Integer id;
    private Integer quesId;
    private String writer;
    private String comment;
    private boolean secret;
    private String inserted;
}
