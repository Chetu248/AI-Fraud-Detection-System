package com.example.backend.service.interfaces;

import com.example.backend.dto.vehicle.VehicleRequest;
import com.example.backend.dto.vehicle.VehicleResponse;

import java.util.List;

public interface VehicleService {

    VehicleResponse createVehicle(
            VehicleRequest request ,
            Long userId
    ) ;

    List<VehicleResponse> getMyVehicle(Long userId) ;

    VehicleResponse getVehicleById(
            Long vehicleId ,
            Long userId
    ) ;

    VehicleResponse updateVehicle(
            Long vehicleId ,
            VehicleRequest request ,
            Long userId
    ) ;

    void deleteVehicle(
            Long vehicleId ,
            Long userId
    ) ;
}
