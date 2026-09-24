package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.repository.WodRepository;
import com.wodexplorer2.backend.entity.Wod;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class WodService {

  private final WodRepository wodRepository;

  public WodService(WodRepository wodRepository) {
    this.wodRepository = wodRepository;
  }

  // READ ALL
  public List<Wod> findAll() {
    return wodRepository.findAll();
  }

  // READ ONE
  public Optional<Wod> findById(Long id) {
    return wodRepository.findById(id);
  }

  // CREATE
  public Wod create(Wod wod) {
    return wodRepository.save(wod);
  }

  // UPDATE
  public Wod update(Long id, Wod wod) {

    Wod existingWod = wodRepository.findById(id)
        .orElseThrow();

    existingWod.update(wod.getName());

    return wodRepository.save(existingWod);
  }

  // DELETE
  public void deleteById(Long id) {
    wodRepository.deleteById(id);
  }
}