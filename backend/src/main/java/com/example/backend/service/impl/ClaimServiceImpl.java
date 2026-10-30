package com.example.backend.service.impl;

import com.example.backend.dto.claim.ClaimRequest;
import com.example.backend.dto.claim.ClaimResponse;
import com.example.backend.entity.Claim;
import com.example.backend.entity.Vehicle;
import com.example.backend.enums.ClaimStatus;
import com.example.backend.event.ClaimSubmittedEvent;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.ClaimMapper;
import com.example.backend.repository.ClaimRepository;
import com.example.backend.repository.InsurancePolicyRepository;
import com.example.backend.repository.VehicleRepository;
import com.example.backend.service.interfaces.ClaimService;
import com.example.backend.service.interfaces.KafkaProducerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;
    private final VehicleRepository vehicleRepository;
    private final ClaimMapper claimMapper;
    private final KafkaProducerService kafkaProducerService;
    private final InsurancePolicyRepository insurancePolicyRepository;

    @Override
    public ClaimResponse createClaim(ClaimRequest requestDTO) {

        Vehicle vehicle = vehicleRepository.findById(requestDTO.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vehicle not found with id: " + requestDTO.getVehicleId()
                ));

        Claim claim = claimMapper.toEntity(requestDTO);

        claim.setVehicle(vehicle);
        claim.setStatus(ClaimStatus.PENDING);

        Claim savedClaim = claimRepository.save(claim);

        LocalDateTime submittedAt = LocalDateTime.now();
        LocalDateTime ninetyDaysAgo = savedClaim.getClaimDate().minusDays(90);
        long totalVehicleClaims = claimRepository.countByVehicleId(savedClaim.getVehicle().getId());
        long claimsLast90Days = claimRepository.countByVehicleIdAndClaimDateBetween(
                savedClaim.getVehicle().getId(), ninetyDaysAgo, savedClaim.getClaimDate());

        var activePolicy = insurancePolicyRepository.findByVehicleId(savedClaim.getVehicle().getId()).stream()
                .filter(policy -> !policy.getStartDate().isAfter(savedClaim.getClaimDate().toLocalDate()))
                .filter(policy -> !policy.getEndDate().isBefore(savedClaim.getClaimDate().toLocalDate()))
                .max(Comparator.comparing(policy -> policy.getStartDate()))
                .orElse(null);

        ClaimSubmittedEvent event = ClaimSubmittedEvent.builder()
                .claimId(savedClaim.getId())
                .vehicleId(savedClaim.getVehicle().getId())
                .claimAmount(savedClaim.getClaimAmount())
                .claimDate(savedClaim.getClaimDate())
                .submittedAt(submittedAt)
                .premiumAmount(activePolicy != null ? activePolicy.getPremiumAmount() : null)
                .policyStartDate(activePolicy != null ? activePolicy.getStartDate() : null)
                .previousClaimsCount(Math.max(totalVehicleClaims - 1, 0))
                .claimsLast90Days(Math.max(claimsLast90Days - 1, 0))
                .build();

        kafkaProducerService.publishClaimSubmittedEvent(event);

        return claimMapper.toResponseDTO(savedClaim);
    }

    @Override
    public List<ClaimResponse> getAllClaims() {
        return claimRepository.findAll()
                .stream()
                .map(claimMapper::toResponseDTO)
                .toList();
    }

    @Override
    public ClaimResponse getClaimById(Long id) {
        Claim claim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Claim not found with id: " + id
                ));

        return claimMapper.toResponseDTO(claim);
    }

    @Override
    public ClaimResponse updateClaim(Long id, ClaimRequest requestDTO) {
        Claim existingClaim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Claim not found with id: " + id
                ));

        Vehicle vehicle = vehicleRepository.findById(requestDTO.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Vehicle not found with id: " + requestDTO.getVehicleId()
                ));

        existingClaim.setVehicle(vehicle);
        existingClaim.setClaimAmount(requestDTO.getClaimAmount());
        existingClaim.setDescription(requestDTO.getDescription());
        existingClaim.setClaimDate(requestDTO.getClaimDate());

        Claim updatedClaim = claimRepository.save(existingClaim);

        return claimMapper.toResponseDTO(updatedClaim);
    }

    @Override
    public void deleteClaim(Long id) {
        Claim existingClaim = claimRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Claim not found with id: " + id
                ));

        claimRepository.delete(existingClaim);
    }
}