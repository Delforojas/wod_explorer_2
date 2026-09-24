package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.entity.WodResult;
import com.wodexplorer2.backend.service.WodResultService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wod-results")
public class WodResultController {

    private final WodResultService wodResultService;

    public WodResultController(WodResultService wodResultService) {
        this.wodResultService = wodResultService;
    }

    @GetMapping
    public List<WodResult> findAll() {
        return wodResultService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<WodResult> findById(@PathVariable Long id) {
        return wodResultService.findById(id);
    }

    @PostMapping
    public WodResult create(@RequestBody WodResult wodResult) {
        return wodResultService.create(wodResult);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        wodResultService.deleteById(id);
    }
}