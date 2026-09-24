package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.entity.Wod;
import com.wodexplorer2.backend.service.WodService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/wods")
public class WodController {

    private final WodService wodService;

    public WodController(WodService wodService) {
        this.wodService = wodService;
    }

    @GetMapping
    public List<Wod> findAll() {
        return wodService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Wod> findById(@PathVariable Long id) {
        return wodService.findById(id);
    }

    @PostMapping
    public Wod create(@RequestBody Wod wod) {
        return wodService.create(wod);
    }

    @PutMapping("/{id}")
    public Wod update(
            @PathVariable Long id,
            @RequestBody Wod wod) {

        return wodService.update(id, wod);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        wodService.deleteById(id);
    }
}