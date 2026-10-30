package com.example.backend.service.impl;

import com.example.backend.dto.policy.InsurancePolicyRequest;
import com.example.backend.dto.policy.InsurancePolicyResponse;
import com.example.backend.entity.InsurancePolicy;
import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.InsurancePolicyRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VehicleRepository;
import com.example.backend.service.interfaces.InsurancePolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InsurancePolicyServiceImpl implements InsurancePolicyService {

    private final InsurancePolicyRepository policyRepository ;
    private final VehicleRepository vehicleRepository ;
    private final UserRepository userRepository ;

    @Override
    @Transactional
    public InsurancePolicyResponse createPolicy(InsurancePolicyRequest request,
                                                Long userId) {
       if(policyRepository.existsByPolicyNumber(request.getPolicyNumber())) {
           throw new RuntimeException("policy with this policy number already exists") ;
       }

       User user = userRepository.findById(userId)
               .orElseThrow(() -> new RuntimeException("user not found")) ;

       Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
               .orElseThrow(() -> new ResourceNotFoundException("vehicle not found")) ;

       if(!vehicle.getUser().getId().equals(user.getId())) {
           throw new RuntimeException("you are not authorized to create policy") ;
       }

        InsurancePolicy policy = new InsurancePolicy() ;

        policy.setPolicyNumber(request.getPolicyNumber());
        policy.setPolicyType(request.getPolicyType());
        policy.setStartDate(request.getStartDate());
        policy.setEndDate(request.getEndDate());
        policy.setPremiumAmount(request.getPremiumAmount());
        policy.setStatus(request.getStatus());
        policy.setVehicle(vehicle);

        InsurancePolicy savedPolicy = policyRepository.save(policy) ;

        return mapToResponse(savedPolicy) ;
    }

    @Override
    @Transactional(readOnly = true)
    public List<InsurancePolicyResponse> getMyPolicies(Long userId) {

        return policyRepository.findByVehicleUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<InsurancePolicyResponse> getPoliciesByVehicle(Long vehicleId,
                                                              Long userId) {
         Vehicle vehicle = vehicleRepository.findById(vehicleId)
                 .orElseThrow(() -> new ResourceNotFoundException("vehicle not found")) ;

         if(!vehicle.getUser().getId().equals(userId)) {
             throw new RuntimeException("you are not authorised") ;
         }

         return policyRepository.findByVehicleId(vehicleId)
                 .stream()
                 .map(this::mapToResponse)
                 .toList() ;
    }

    @Override
    @Transactional(readOnly = true)
    public InsurancePolicyResponse getPolicyById(Long policyId, Long userId) {
        InsurancePolicy policy = policyRepository.findById(policyId)
                .orElseThrow(() -> new ResourceNotFoundException("policy not found")) ;

        if(!policy.getVehicle()
                .getUser()
                .getId().equals(userId)) {
            throw new RuntimeException("you are not authorised to access the policy") ;
        }

        return mapToResponse(policy) ;
    }

    @Override
    @Transactional
    public InsurancePolicyResponse updatePolicy(Long policyId,
                                                InsurancePolicyRequest request,
                                                Long userId) {
        InsurancePolicy policy =
                policyRepository.findById(policyId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Policy not found"
                                )
                        );

        if (!policy.getVehicle()
                .getUser()
                .getId()
                .equals(userId)) {

            throw new RuntimeException(
                    "You are not authorized to update this policy"
            );
        }

        Vehicle vehicle = vehicleRepository.findById(
                        request.getVehicleId()
                )
                .orElseThrow(() ->
                        new ResourceNotFoundException("Vehicle not found")
                );

        if (!vehicle.getUser().getId().equals(userId)) {
            throw new RuntimeException(
                    "You are not authorized to use this vehicle"
            );
        }

        policy.setPolicyNumber(request.getPolicyNumber());
        policy.setPolicyType(request.getPolicyType());
        policy.setStartDate(request.getStartDate());
        policy.setEndDate(request.getEndDate());
        policy.setPremiumAmount(request.getPremiumAmount());
        policy.setStatus(request.getStatus());
        policy.setVehicle(vehicle);

        InsurancePolicy updatedPolicy =
                policyRepository.save(policy);

        return mapToResponse(updatedPolicy);

    }

    @Override
    @Transactional
    public void deletePolicy(Long policyId, Long userId) {
        InsurancePolicy policy =
                policyRepository.findById(policyId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Policy not found"
                                )
                        );

        if (!policy.getVehicle()
                .getUser()
                .getId()
                .equals(userId)) {

            throw new RuntimeException(
                    "You are not authorized to delete this policy"
            );
        }

        policyRepository.delete(policy);
    }

    private InsurancePolicyResponse mapToResponse(InsurancePolicy policy) {
        InsurancePolicyResponse response =
                new InsurancePolicyResponse();

        response.setId(policy.getId());
        response.setPolicyNumber(
                policy.getPolicyNumber()
        );
        response.setPolicyType(
                policy.getPolicyType()
        );
        response.setStartDate(
                policy.getStartDate()
        );
        response.setEndDate(
                policy.getEndDate()
        );
        response.setPremiumAmount(
                policy.getPremiumAmount()
        );
        response.setStatus(
                policy.getStatus()
        );
        response.setVehicleId(
                policy.getVehicle().getId()
        );

        return response ;
    }
}
