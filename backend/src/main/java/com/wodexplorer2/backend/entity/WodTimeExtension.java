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
@Table(name = "wod_time_extensions")
public class WodTimeExtension {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @OneToOne
  @JoinColumn(name = "wod_version_id", nullable = false)
  private WodVersion wodVersion;

  @Column(name = "initial_seconds", nullable = false)
  private Integer initialSeconds;

  @Column(name = "extension_seconds", nullable = false)
  private Integer extensionSeconds;

  @Column(name = "rounds_per_extension", nullable = false)
  private Integer roundsPerExtension;

  public WodTimeExtension(
      WodVersion wodVersion,
      Integer initialSeconds,
      Integer extensionSeconds,
      Integer roundsPerExtension) {
    this.wodVersion = wodVersion;
    this.initialSeconds = initialSeconds;
    this.extensionSeconds = extensionSeconds;
    this.roundsPerExtension = roundsPerExtension;
  }

  protected WodTimeExtension() {
  }

  public Long getWodVersionId() {
    return wodVersion.getId();
  }

  public Integer getInitialSeconds() {
    return initialSeconds;
  }

  public Integer getExtensionSeconds() {
    return extensionSeconds;
  }

  public Integer getRoundsPerExtension() {
    return roundsPerExtension;
  }
}
