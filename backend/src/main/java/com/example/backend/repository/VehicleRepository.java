package com.example.backend.repository;

import com.example.backend.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle , Long> {

    List<Vehicle> findByUserId(Long userId) ;

    boolean existsByRegistrationNumber(String registrationNumber) ;
}
