package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.entity.WodVersion;
import com.wodexplorer2.backend.service.WodVersionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wod-versions")
public class WodVersionController {

    private final WodVersionService wodVersionService;

    public WodVersionController(WodVersionService wodVersionService) {
        this.wodVersionService = wodVersionService;
    }

    @GetMapping
    public List<WodVersion> findAll() {
        return wodVersionService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<WodVersion> findById(@PathVariable Long id) {
        return wodVersionService.findById(id);
    }

    @PostMapping
    public WodVersion create(@RequestBody WodVersion wodVersion) {
        return wodVersionService.create(wodVersion);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        wodVersionService.deleteById(id);
    }
}