package com.wodexplorer2.backend.dto;

import com.wodexplorer2.backend.entity.WodPrescriptionVariant;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record WodItemPrescriptionRequest(
    @NotNull WodPrescriptionVariant variant,
    @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal weightKg) {
}
