package com.example.backend.dto.comment;

import lombok.Data;

@Data
public class QuestionReComment {
    private Integer id;
    private Integer quesId;
    private Integer parentId;
    private String writer;
    private String comment;
    private boolean secret;
    private String inserted;
}
