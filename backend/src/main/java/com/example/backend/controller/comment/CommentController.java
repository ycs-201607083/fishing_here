package com.example.backend.controller.comment;

import com.example.backend.dto.chart.ChartData;
import com.example.backend.dto.comment.Comment;
import com.example.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
public class CommentController {

    final CommentService service;

    @DeleteMapping("remove/{id}")
    @PreAuthorize("isAuthenticated()")
    public void remove(@PathVariable Integer id, Authentication auth) {
        if (service.hasAccess(id, auth)) {
            service.remove(id);
        }
    }

    @GetMapping("list/{boardId}")
    public List<Comment> list(@PathVariable Integer boardId) {
        return service.list(boardId);
    }

    @PostMapping("add")
    @PreAuthorize("isAuthenticated()")
    public void add(@RequestBody Comment comment, Authentication auth) {
        if (comment.getBoardId() == null) {
            throw new IllegalArgumentException("Board ID is required.");
        }
        service.add(comment, auth);

        // 차트 데이터도 저장
        if (comment.getChartLabel() != null && comment.getChartValue() != null) {
            ChartData chartData = new ChartData();
            chartData.setBoardId(comment.getBoardId());
            chartData.setLabel(comment.getChartLabel());
            chartData.setValue(comment.getChartValue());
            service.addchart(chartData);
        }
    }

    @PostMapping("edit/{id}")
    @PreAuthorize("isAuthenticated()")
    public void edit(@PathVariable Integer id, @RequestBody Comment comment, Authentication auth) {
        if (service.hasAccess(id, auth)) {
            service.edit(id, comment.getComment());
        }
    }


}