package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.dto.WodVersionRequest;
import com.wodexplorer2.backend.dto.WodVersionResponse;
import com.wodexplorer2.backend.mapper.WodVersionMapper;
import jakarta.validation.Valid;
import com.wodexplorer2.backend.service.WodVersionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wod-versions")
public class WodVersionController {

    private final WodVersionService wodVersionService;
    private final WodVersionMapper wodVersionMapper;

    public WodVersionController(
            WodVersionService wodVersionService,
            WodVersionMapper wodVersionMapper) {
        this.wodVersionService = wodVersionService;
        this.wodVersionMapper = wodVersionMapper;
    }

    @GetMapping
    public List<WodVersionResponse> findAll() {
        return wodVersionService.findAll().stream()
                .map(wodVersionMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public WodVersionResponse findById(@PathVariable Long id) {
        return wodVersionMapper.toResponse(wodVersionService.findById(id));
    }

    @PostMapping
    public WodVersionResponse create(@Valid @RequestBody WodVersionRequest request) {
        return wodVersionMapper.toResponse(wodVersionService.create(request));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        wodVersionService.deleteById(id);
    }
}
