package com.wodexplorer2.backend.dto;

import com.wodexplorer2.backend.entity.WodPrescriptionVariant;
import java.math.BigDecimal;

public record WodItemPrescriptionResponse(WodPrescriptionVariant variant, BigDecimal weightKg) {
}
