package com.example.backend.service.impl;

import com.example.backend.dto.vehicle.VehicleRequest;
import com.example.backend.dto.vehicle.VehicleResponse;
import com.example.backend.entity.User;
import com.example.backend.entity.Vehicle;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.VehicleRepository;
import com.example.backend.service.interfaces.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository ;
    private final UserRepository userRepository ;

    @Override
    @Transactional
    public VehicleResponse createVehicle(VehicleRequest request, Long userId) {
        if(vehicleRepository.existsByRegistrationNumber(
                request.getRegistrationNumber())) {
            throw new RuntimeException("vehicle with this registration Number already exists") ;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("user not found")) ;

        Vehicle vehicle = new Vehicle() ;

        vehicle.setRegistrationNumber(request.getRegistrationNumber()) ;
        vehicle.setVehicleType(request.getVehicleType()) ;
        vehicle.setMake(request.getMake()) ;
        vehicle.setModel(request.getModel()) ;

        vehicle.setUser(user) ;

        Vehicle savedVehicle = vehicleRepository.save(vehicle) ;

        return mapToResponse(savedVehicle) ;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> getMyVehicle(Long userId) {
        return vehicleRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList() ;
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(Long vehicleId, Long userId) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("vehicle not found"));

        if(!vehicle.getUser().getId().equals(userId)) {
            throw new RuntimeException("you are not authorised to access this vehicle") ;
        }

        return mapToResponse(vehicle) ;
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Long vehicleId,
                                         VehicleRequest request,
                                         Long userId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found")
                );

        if (!vehicle.getUser().getId().equals(userId)) {
            throw new RuntimeException(
                    "You are not authorized to update this vehicle"
            );
        }

        vehicle.setRegistrationNumber(
                request.getRegistrationNumber()
        );
        vehicle.setVehicleType(
                request.getVehicleType()
        );
        vehicle.setMake(
                request.getMake()
        );
        vehicle.setModel(
                request.getModel()
        );

        Vehicle updatedVehicle =
                vehicleRepository.save(vehicle);

        return mapToResponse(updatedVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long vehicleId, Long userId) {

        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() ->
                        new RuntimeException("Vehicle not found")
                );

        if (!vehicle.getUser().getId().equals(userId)) {
            throw new RuntimeException(
                    "You are not authorized to delete this vehicle"
            );
        }

        vehicleRepository.delete(vehicle);
    }

    private VehicleResponse mapToResponse(Vehicle vehicle) {
        VehicleResponse response = new VehicleResponse();

        response.setId(vehicle.getId());
        response.setRegistrationNumber(vehicle.getRegistrationNumber());
        response.setVehicleType(vehicle.getVehicleType());
        response.setMake(vehicle.getMake());
        response.setModel(vehicle.getModel());
//        response.setUserId(vehicle.getUser().getId());

        return response;
    }
}
