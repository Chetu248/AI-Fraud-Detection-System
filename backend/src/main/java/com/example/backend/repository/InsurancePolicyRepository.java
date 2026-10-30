package com.example.backend.repository;

import com.example.backend.entity.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InsurancePolicyRepository extends
        JpaRepository<InsurancePolicy , Long> {

    Optional<InsurancePolicy> findByPolicyNumber(String policyNumber) ;

    List<InsurancePolicy> findByVehicleId(Long vehicleId) ;

    List<InsurancePolicy> findByVehicleUserId(Long userId);

    boolean existsByPolicyNumber(String policyNimber) ;
}
