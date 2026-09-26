package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.dto.WodRequest;
import com.wodexplorer2.backend.dto.WodResponse;
import com.wodexplorer2.backend.mapper.WodMapper;
import jakarta.validation.Valid;
import com.wodexplorer2.backend.service.WodService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wods")
public class WodController {

  private final WodService wodService;
  private final WodMapper wodMapper;

    public WodController(
            WodService wodService,
            WodMapper wodMapper) {
        this.wodService = wodService;
        this.wodMapper = wodMapper;
    }

    @GetMapping
    public List<WodResponse> findAll() {
        return wodService.findVisible().stream()
                .map(wodMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public WodResponse findById(@PathVariable Long id) {
        return wodMapper.toResponse(wodService.findVisibleById(id));
    }

    @PostMapping
    public WodResponse create(@Valid @RequestBody WodRequest request) {
        return wodMapper.toResponse(wodService.create(request));
    }

    @PutMapping("/{id}")
    public WodResponse update(
            @PathVariable Long id,
            @Valid @RequestBody WodRequest request) {

        return wodMapper.toResponse(wodService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        wodService.archive(id);
    }
}
