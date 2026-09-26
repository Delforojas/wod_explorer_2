package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.dto.WodResultRequest;
import com.wodexplorer2.backend.dto.WodResultResponse;
import com.wodexplorer2.backend.mapper.WodResultMapper;
import jakarta.validation.Valid;
import com.wodexplorer2.backend.service.WodResultService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wod-results")
public class WodResultController {

    private final WodResultService wodResultService;
    private final WodResultMapper wodResultMapper;

    public WodResultController(
            WodResultService wodResultService,
            WodResultMapper wodResultMapper) {
        this.wodResultService = wodResultService;
        this.wodResultMapper = wodResultMapper;
    }

    @GetMapping
    public List<WodResultResponse> findAll() {
        return wodResultService.findAll().stream()
                .map(wodResultMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public WodResultResponse findById(@PathVariable Long id) {
        return wodResultMapper.toResponse(wodResultService.findById(id));
    }

    @PostMapping
    public WodResultResponse create(@Valid @RequestBody WodResultRequest request) {
        return wodResultMapper.toResponse(wodResultService.create(request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        wodResultService.deleteById(id);
    }
}
