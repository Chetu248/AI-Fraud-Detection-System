package com.example.backend.mapper;

import com.example.backend.dto.claim.ClaimRequest;
import com.example.backend.dto.claim.ClaimResponse;
import com.example.backend.entity.Claim;
import org.springframework.stereotype.Component;

@Component
public class ClaimMapper {

    public Claim toEntity(ClaimRequest dto) {
        Claim claim = new Claim() ;

        claim.setClaimAmount(dto.getClaimAmount()) ;
        claim.setClaimDate(dto.getClaimDate()) ;
        claim.setDescription(dto.getDescription()) ;

        return claim ;
    }

    public ClaimResponse toResponseDTO(Claim claim) {
        ClaimResponse dto = new ClaimResponse() ;

        dto.setId(claim.getId());
        dto.setVehicleId(claim.getVehicle().getId());
        dto.setClaimAmount(claim.getClaimAmount());
        dto.setDescription(claim.getDescription());
        dto.setClaimDate(claim.getClaimDate());
        dto.setStatus(claim.getStatus());

        return dto ;
    }
}
