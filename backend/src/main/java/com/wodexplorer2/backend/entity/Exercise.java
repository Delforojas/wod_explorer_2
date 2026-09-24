package com.wodexplorer2.backend.entity;

import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ExerciseCategory category;

    @Column(name = "measurement_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private MeasurementType measurementType;

    @Column(nullable = false)
    private boolean active = true;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public ExerciseCategory getCategory() {
        return category;
    }

    public MeasurementType getMeasurementType() {
        return measurementType;
    }

    public boolean isActive() {
        return active;
    }

    public void update(String name,
            ExerciseCategory category,
            MeasurementType measurementType) {
        this.name = name;
        this.category = category;
        this.measurementType = measurementType;
    }

    public Exercise(
            String name,
            ExerciseCategory category,
            MeasurementType measurementType) {
        this.name = name;
        this.category = category;
        this.measurementType = measurementType;
    }

    protected Exercise() {
    }
}
