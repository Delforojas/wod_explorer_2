package com.wodexplorer2.backend.entity;

import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
@Table(name = "wod_versions")
public class WodVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "wod_id", nullable = false)
    private Wod wod;

    @Column(name = "version_number", nullable = false)
    private Integer versionNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WodType type;

    @Column(name = "time_cap_seconds")
    private Integer timeCapSeconds;

    @Column
    private Integer rounds;

    @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
    private LocalDateTime createdAt;

    public Long getId() {
        return id;
    }

    public Wod getWod() {
        return wod;
    }

    public Integer getVersionNumber() {
        return versionNumber;
    }

    public WodType getType() {
        return type;
    }

    public Integer getTimeCapSeconds() {
        return timeCapSeconds;
    }

    public Integer getRounds() {
        return rounds;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public WodVersion(
            Wod wod,
            Integer versionNumber,
            WodType type,
            Integer timeCapSeconds,
            Integer rounds) {

        this.wod = wod;
        this.versionNumber = versionNumber;
        this.type = type;
        this.timeCapSeconds = timeCapSeconds;
        this.rounds = rounds;
    }

    protected WodVersion() {
    }
}