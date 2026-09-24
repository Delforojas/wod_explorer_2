package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.repository.WodVersionRepository;
import com.wodexplorer2.backend.entity.WodVersion;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class WodVersionService {

  private final WodVersionRepository wodVersionRepository;

  public WodVersionService(WodVersionRepository wodVersionRepository) {
    this.wodVersionRepository = wodVersionRepository;
  }

  // READ ALL
  public List<WodVersion> findAll() {
    return wodVersionRepository.findAll();
  }

  // READ ONE
  public Optional<WodVersion> findById(Long id) {
    return wodVersionRepository.findById(id);
  }

  // CREATE
  public WodVersion create(WodVersion wodVersion) {
    return wodVersionRepository.save(wodVersion);
  }

  // DELETE
  public void deleteById(Long id) {
    wodVersionRepository.deleteById(id);
  }
}