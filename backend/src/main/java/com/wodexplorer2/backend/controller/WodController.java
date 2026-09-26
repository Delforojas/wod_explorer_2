package com.wodexplorer2.backend.controller;

import com.wodexplorer2.backend.dto.WodAggregateResponse;
import com.wodexplorer2.backend.dto.WodDefinitionRequest;
import jakarta.validation.Valid;
import com.wodexplorer2.backend.service.WodAggregateService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wods")
public class WodController {

  private final WodAggregateService wodAggregateService;

  public WodController(WodAggregateService wodAggregateService) {
    this.wodAggregateService = wodAggregateService;
  }

  @GetMapping
  public List<WodAggregateResponse> findAll() {
    return wodAggregateService.findAll();
  }

  @GetMapping("/{id}")
  public WodAggregateResponse findById(@PathVariable Long id) {
    return wodAggregateService.findById(id);
  }

  @PostMapping
  public WodAggregateResponse create(@Valid @RequestBody WodDefinitionRequest request) {
    return wodAggregateService.create(request);
  }

  @PutMapping("/{id}")
  public WodAggregateResponse update(
      @PathVariable Long id,
      @Valid @RequestBody WodDefinitionRequest request) {
    return wodAggregateService.update(id, request);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable Long id) {
    wodAggregateService.archive(id);
  }
}
