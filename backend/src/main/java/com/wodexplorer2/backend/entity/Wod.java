package com.wodexplorer2.backend.entity;

import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

import jakarta.persistence.Column;

@Entity
@Table(name = "wods")
public class Wod {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "owner_id", nullable = true)
  private User owner;

  @Column(nullable = false, length = 100)
  private String name;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private WodOrigin origin;

  @Column(name = "created_at", nullable = false, insertable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "deleted_at")
  private LocalDateTime deletedAt;

  public Long getId() {
    return id;
  }

  public User getOwner() {
    return owner;
  }

  public String getName() {
    return name;
  }

  public WodOrigin getOrigin() {
    return origin;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public LocalDateTime getDeletedAt() {
    return deletedAt;
  }

  public void update(String name) {
    this.name = name;
  }

  public void archive() {
    this.deletedAt = LocalDateTime.now();
  }

  public Wod(
      User owner,
      String name,
      WodOrigin origin) {

    this.owner = owner;
    this.name = name;
    this.origin = origin;
  }

  protected Wod() {
  }
}
