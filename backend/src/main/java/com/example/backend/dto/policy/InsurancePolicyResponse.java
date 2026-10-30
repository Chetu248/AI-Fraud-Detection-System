package com.example.backend.dto.policy;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class InsurancePolicyResponse {

    private Long id ;

    private String policyNumber ;

    private String policyType ;

    private LocalDate startDate ;

    private LocalDate endDate ;

    private BigDecimal premiumAmount ;

    private String status ;

    private Long vehicleId ;
}
