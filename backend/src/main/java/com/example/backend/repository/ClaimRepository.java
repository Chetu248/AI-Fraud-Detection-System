package com.example.backend.repository;

import com.example.backend.entity.Claim;
import com.example.backend.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    long countByStatus(ClaimStatus status);

    long countByVehicleId(Long vehicleId);

    long countByVehicleIdAndClaimDateBetween(Long vehicleId, LocalDateTime from, LocalDateTime to);
}
