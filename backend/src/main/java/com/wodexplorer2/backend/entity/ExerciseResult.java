package com.wodexplorer2.backend.entity;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import jakarta.persistence.Column;

@Entity
@Table(name = "exercise_results")
public class ExerciseResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column
    private Integer reps;

    @Column(name = "weight_kg", precision = 8, scale = 3)
    private BigDecimal weightKg;

    @Column(name = "distance_m", precision = 10, scale = 2)
    private BigDecimal distanceM;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "performed_at", nullable = false)
    private LocalDateTime performedAt;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public Exercise getExercise() {
        return exercise;
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

    public LocalDateTime getPerformedAt() {
        return performedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void update(
            User user,
            Exercise exercise,
            Integer reps,
            BigDecimal weightKg,
            BigDecimal distanceM,
            Integer durationSeconds,
            LocalDateTime performedAt) {

        this.user = user;
        this.exercise = exercise;
        this.reps = reps;
        this.weightKg = weightKg;
        this.distanceM = distanceM;
        this.durationSeconds = durationSeconds;
        this.performedAt = performedAt;
    }

    public ExerciseResult(
            User user,
            Exercise exercise,
            Integer reps,
            BigDecimal weightKg,
            BigDecimal distanceM,
            Integer durationSeconds,
            LocalDateTime performedAt) {

        this.user = user;
        this.exercise = exercise;
        this.reps = reps;
        this.weightKg = weightKg;
        this.distanceM = distanceM;
        this.durationSeconds = durationSeconds;
        this.performedAt = performedAt;
    }

    protected ExerciseResult() {
    }
}
