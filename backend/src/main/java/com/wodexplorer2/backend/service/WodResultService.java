package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.entity.WodResult;
import com.wodexplorer2.backend.repository.WodResultRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WodResultService {

    private final WodResultRepository wodResultRepository;

    public WodResultService(WodResultRepository wodResultRepository) {
        this.wodResultRepository = wodResultRepository;
    }

    // READ ALL
    public List<WodResult> findAll() {
        return wodResultRepository.findAll();
    }

    // READ ONE
    public Optional<WodResult> findById(Long id) {
        return wodResultRepository.findById(id);
    }

    // CREATE
    public WodResult create(WodResult wodResult) {
        return wodResultRepository.save(wodResult);
    }

    // DELETE
    public void deleteById(Long id) {
        wodResultRepository.deleteById(id);
    }
}