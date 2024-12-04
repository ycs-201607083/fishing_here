package com.example.backend.service.manager;

import com.example.backend.dto.board.Board;
import com.example.backend.dto.member.Member;
import com.example.backend.mapper.manager.ManagerMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ManagerService {
    final ManagerMapper mapper;

    public List<Member> memberList() {
        return mapper.selectMemberAll();
    }

    public List<Board> boardList() {
        return mapper.selectBoardAll();
    }
}

