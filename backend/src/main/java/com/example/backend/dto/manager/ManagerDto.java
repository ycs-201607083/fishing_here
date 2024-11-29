package com.example.backend.dto.manager;

import com.example.backend.dto.board.Board;
import com.example.backend.dto.member.Member;
import lombok.Data;

import java.util.List;

@Data
public class ManagerDto {
    private List<Board> boards;
    private List<Member> members;

    public ManagerDto(List<Member> members, List<Board> boards) {
        this.members = members;
        this.boards = boards;
    }
}


