package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.dto.WodVersionItemResponse;
import com.wodexplorer2.backend.mapper.WodVersionItemMapper;
import com.wodexplorer2.backend.service.WodVersionItemService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wod-version-items")
public class WodVersionItemController {

    private final WodVersionItemService wodVersionItemService;
    private final WodVersionItemMapper wodVersionItemMapper;

    public WodVersionItemController(
            WodVersionItemService wodVersionItemService,
            WodVersionItemMapper wodVersionItemMapper) {
        this.wodVersionItemService = wodVersionItemService;
        this.wodVersionItemMapper = wodVersionItemMapper;
    }

    @GetMapping
    public List<WodVersionItemResponse> findAll() {
        return wodVersionItemService.findAll().stream()
                .map(wodVersionItemMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public WodVersionItemResponse findById(@PathVariable Long id) {
        return wodVersionItemMapper.toResponse(wodVersionItemService.findById(id));
    }

}
