package com.example.backend.dto.board;

import lombok.Data;

import java.util.List;

@Data
public class Announcement {
    private Integer id;
    private String title;
    private String content;
    private String writer;
    private String inserted;

    //파일목록
    private List<AnnFile> fileList;
}
