package com.example.backend.dto.board;

import lombok.Data;

import java.util.List;

@Data
public class Board {
    private Integer number;
    private String title;
    private String content;
    private String writer;
    private Integer viewCount;
    private String date;
    private String site;//민물낚시, 바다낚시
    private Integer likeCount;


    private List<BoardFile> fileList;
    private KakaoMapAddress kakaoAddress;
}
