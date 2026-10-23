package com.wodexplorer2.backend.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wod_results")
public class WodResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "wod_version_id", nullable = false)
    private WodVersion wodVersion;

    @Column(name = "performed_at", nullable = false)
    private LocalDateTime performedAt;

    @Column
    private Boolean completed;

    @Column(name = "time_seconds")
    private Integer timeSeconds;

    @Column(name = "progress_rounds")
    private Integer progressRounds;

    @ManyToOne
    @JoinColumn(name = "progress_item_id")
    private WodVersionItem progressItem;

    @Column(name = "progress_reps")
    private Integer progressReps;

    @Column(name = "progress_distance_m", precision = 10, scale = 2)
    private BigDecimal progressDistanceM;

    @Column(name = "progress_duration_seconds")
    private Integer progressDurationSeconds;

    @Column(name = "amrap_rounds")
    private Integer amrapRounds;

    @Column(name = "amrap_extra_reps")
    private Integer amrapExtraReps;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public WodVersion getWodVersion() {
        return wodVersion;
    }

    public LocalDateTime getPerformedAt() {
        return performedAt;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public Integer getTimeSeconds() {
        return timeSeconds;
    }

    public Integer getProgressRounds() {
        return progressRounds;
    }

    public WodVersionItem getProgressItem() {
        return progressItem;
    }

    public Integer getProgressReps() {
        return progressReps;
    }

    public BigDecimal getProgressDistanceM() {
        return progressDistanceM;
    }

    public Integer getProgressDurationSeconds() {
        return progressDurationSeconds;
    }

    public Integer getAmrapRounds() {
        return amrapRounds;
    }

    public Integer getAmrapExtraReps() {
        return amrapExtraReps;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public WodResult(
            User user,
            WodVersion wodVersion,
            LocalDateTime performedAt,
            Boolean completed,
            Integer timeSeconds,
            Integer progressRounds,
            WodVersionItem progressItem,
            Integer progressReps,
            BigDecimal progressDistanceM,
            Integer progressDurationSeconds,
            Integer amrapRounds,
            Integer amrapExtraReps) {

        this.user = user;
        this.wodVersion = wodVersion;
        this.performedAt = performedAt;
        this.completed = completed;
        this.timeSeconds = timeSeconds;
        this.progressRounds = progressRounds;
        this.progressItem = progressItem;
        this.progressReps = progressReps;
        this.progressDistanceM = progressDistanceM;
        this.progressDurationSeconds = progressDurationSeconds;
        this.amrapRounds = amrapRounds;
        this.amrapExtraReps = amrapExtraReps;
    }

    protected WodResult() {
    }

}
