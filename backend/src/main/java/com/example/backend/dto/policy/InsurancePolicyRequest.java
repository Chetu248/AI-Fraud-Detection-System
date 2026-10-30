package com.example.backend.dto.policy;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class InsurancePolicyRequest {

    @NotBlank(message = "Policy Number is required")
    private String policyNumber ;

    @NotBlank(message = "Policy Type is required")
    private String policyType ;

    @NotBlank(message = "Start Date is required")
    private LocalDate startDate ;

    @NotBlank(message = "End Date is required")
    private LocalDate endDate ;

    @NotNull(message = "Premium amount is required")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Premium amount must be greater than 0")
    private BigDecimal premiumAmount ;

    @NotBlank(message = "status is required")
    private String status ;

    @NotBlank(message = "Vehicle Id is required")
    private Long vehicleId ;
}
