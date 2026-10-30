package com.example.backend.dto.claim;

import com.example.backend.enums.ClaimStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class ClaimResponse {

    private Long id ;

    private Long vehicleId ;

    private BigDecimal claimAmount ;

    private String description ;

    private LocalDateTime claimDate ;

    private ClaimStatus status ;
}
