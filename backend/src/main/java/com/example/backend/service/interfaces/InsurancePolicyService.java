package com.example.backend.service.interfaces;

import com.example.backend.dto.policy.InsurancePolicyRequest;
import com.example.backend.dto.policy.InsurancePolicyResponse;

import java.util.List;

public interface InsurancePolicyService {

    InsurancePolicyResponse createPolicy(InsurancePolicyRequest request ,
                                         Long userId) ;

    List<InsurancePolicyResponse> getMyPolicies(Long userIs) ;

    List<InsurancePolicyResponse> getPoliciesByVehicle(
            Long vehicleId ,
            Long userId) ;

    InsurancePolicyResponse getPolicyById(Long policyId , Long userId) ;

    InsurancePolicyResponse updatePolicy(Long policyId ,
                                         InsurancePolicyRequest request ,
                                         Long userId) ;

    void deletePolicy(Long policyId , Long userId) ;
}
