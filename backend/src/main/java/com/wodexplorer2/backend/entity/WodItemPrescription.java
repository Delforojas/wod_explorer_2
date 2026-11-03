package com.wodexplorer2.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "wod_item_prescriptions")
public class WodItemPrescription {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "wod_version_item_id", nullable = false)
  private WodVersionItem wodVersionItem;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 20)
  private WodPrescriptionVariant variant;

  @Column(name = "weight_kg", nullable = false, precision = 8, scale = 3)
  private BigDecimal weightKg;

  public WodItemPrescription(
      WodVersionItem wodVersionItem,
      WodPrescriptionVariant variant,
      BigDecimal weightKg) {
    this.wodVersionItem = wodVersionItem;
    this.variant = variant;
    this.weightKg = weightKg;
  }

  protected WodItemPrescription() {
  }

  public Long getWodVersionItemId() {
    return wodVersionItem.getId();
  }

  public WodPrescriptionVariant getVariant() {
    return variant;
  }

  public BigDecimal getWeightKg() {
    return weightKg;
  }
}
