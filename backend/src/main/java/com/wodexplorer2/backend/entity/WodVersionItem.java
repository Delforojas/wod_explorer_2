package com.wodexplorer2.backend.entity;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import jakarta.persistence.Column;

@Entity
@Table(name = "wod_version_items")
public class WodVersionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "wod_version_id", nullable = false)
    private WodVersion wodVersion;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(nullable = false)
    private Integer position;

    @Column
    private Integer reps;

    @Column(name = "weight_kg", precision = 8, scale = 3)
    private BigDecimal weightKg;

    @Column(name = "distance_m", precision = 10, scale = 2)
    private BigDecimal distanceM;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    public Long getId() {
        return id;
    }

    public WodVersion getWodVersion() {
        return wodVersion;
    }

    public Exercise getExercise() {
        return exercise;
    }

    public Integer getPosition() {
        return position;
    }

    public Integer getReps() {
        return reps;
    }

    public BigDecimal getWeightKg() {
        return weightKg;
    }

    public BigDecimal getDistanceM() {
        return distanceM;
    }

    public Integer getDurationSeconds() {
        return durationSeconds;
    }

    public WodVersionItem(
            WodVersion wodVersion,
            Exercise exercise,
            Integer position,
            Integer reps,
            BigDecimal weightKg,
            BigDecimal distanceM,
            Integer durationSeconds) {

        this.wodVersion = wodVersion;
        this.exercise = exercise;
        this.position = position;
        this.reps = reps;
        this.weightKg = weightKg;
        this.distanceM = distanceM;
        this.durationSeconds = durationSeconds;
    }

    protected WodVersionItem() {
    }
}