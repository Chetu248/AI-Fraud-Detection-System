package com.example.backend.controller;

import com.example.backend.dto.vehicle.VehicleRequest;
import com.example.backend.dto.vehicle.VehicleResponse;
import com.example.backend.service.interfaces.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService ;

    @PostMapping
    public ResponseEntity<VehicleResponse> createVehicle(
            @Valid @RequestBody VehicleRequest request ,
            Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName()) ;

        VehicleResponse response = vehicleService.createVehicle(request , userId) ;

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response) ; 
    }

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> getMyVehicle(
            Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName()) ;

        List<VehicleResponse> vehicles = vehicleService.getMyVehicle(userId) ;

        return ResponseEntity.ok(vehicles) ;
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(
            @PathVariable Long id , Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName()) ;

        VehicleResponse response = vehicleService.getVehicleById(id , userId) ;

        return ResponseEntity.ok(response) ;
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> updateVehicle(
            @PathVariable Long id ,
            @Valid @RequestBody VehicleRequest request ,
            Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName()) ;

        VehicleResponse response = vehicleService.updateVehicle(id , request , userId) ;

        return ResponseEntity.ok(response) ;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(
            @PathVariable Long id , Authentication authentication) {
        Long userId = Long.valueOf(authentication.getName()) ;

        vehicleService.deleteVehicle(id , userId) ;

        return ResponseEntity.noContent().build() ;
    }
}
