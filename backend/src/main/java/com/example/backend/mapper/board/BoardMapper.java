package com.example.backend.mapper.board;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardMapper {
    @Select("""
            SELECT *
            FROM tag
            ORDER BY tag_id ASC
            """)
    List<String> selectALlTag();
}
