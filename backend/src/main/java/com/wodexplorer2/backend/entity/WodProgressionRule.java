package com.wodexplorer2.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "wod_progression_rules")
public class WodProgressionRule {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "wod_version_id", nullable = false)
  private WodVersion wodVersion;

  @Column(name = "start_reps", nullable = false)
  private Integer startReps;

  @Column(name = "increment_reps", nullable = false)
  private Integer incrementReps;

  @Column(name = "every_rounds", nullable = false)
  private Integer everyRounds;

  public WodProgressionRule(WodVersion wodVersion, Integer startReps, Integer incrementReps, Integer everyRounds) {
    this.wodVersion = wodVersion;
    this.startReps = startReps;
    this.incrementReps = incrementReps;
    this.everyRounds = everyRounds;
  }

  protected WodProgressionRule() {
  }

  public Long getWodVersionId() {
    return wodVersion.getId();
  }

  public Integer getStartReps() {
    return startReps;
  }

  public Integer getIncrementReps() {
    return incrementReps;
  }

  public Integer getEveryRounds() {
    return everyRounds;
  }
}
