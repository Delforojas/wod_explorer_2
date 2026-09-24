package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.entity.WodVersionItem;
import com.wodexplorer2.backend.service.WodVersionItemService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wod-version-items")
public class WodVersionItemController {

    private final WodVersionItemService wodVersionItemService;

    public WodVersionItemController(
            WodVersionItemService wodVersionItemService) {
        this.wodVersionItemService = wodVersionItemService;
    }

    @GetMapping
    public List<WodVersionItem> findAll() {
        return wodVersionItemService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<WodVersionItem> findById(@PathVariable Long id) {
        return wodVersionItemService.findById(id);
    }

    @PostMapping
    public WodVersionItem create(@RequestBody WodVersionItem wodVersionItem) {
        return wodVersionItemService.create(wodVersionItem);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        wodVersionItemService.deleteById(id);
    }
}