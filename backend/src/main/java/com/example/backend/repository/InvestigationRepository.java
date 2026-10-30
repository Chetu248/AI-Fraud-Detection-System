package com.example.backend.repository;

import com.example.backend.entity.Investigation;
import com.example.backend.enums.InvestigationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvestigationRepository extends JpaRepository<Investigation , Long> {

    Optional<Investigation> findByClaimId(Long claimId) ;

    List<Investigation> findByStatus(InvestigationStatus status) ;

    long countByStatus(InvestigationStatus status) ;
}
