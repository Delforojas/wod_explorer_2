package com.wodexplorer2.backend.service;

import com.wodexplorer2.backend.entity.WodVersionItem;
import com.wodexplorer2.backend.repository.WodVersionItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WodVersionItemService {

    private final WodVersionItemRepository wodVersionItemRepository;

    public WodVersionItemService(
            WodVersionItemRepository wodVersionItemRepository) {
        this.wodVersionItemRepository = wodVersionItemRepository;
    }

    // READ ALL
    public List<WodVersionItem> findAll() {
        return wodVersionItemRepository.findAll();
    }

    // READ ONE
    public Optional<WodVersionItem> findById(Long id) {
        return wodVersionItemRepository.findById(id);
    }

    // CREATE
    public WodVersionItem create(WodVersionItem wodVersionItem) {
        return wodVersionItemRepository.save(wodVersionItem);
    }

    // DELETE
    public void deleteById(Long id) {
        wodVersionItemRepository.deleteById(id);
    }
}