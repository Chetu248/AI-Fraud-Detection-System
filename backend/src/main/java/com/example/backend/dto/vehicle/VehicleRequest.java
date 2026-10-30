package com.example.backend.dto.vehicle;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleRequest {

    @NotBlank(message = "registration_number are required")
    private String registrationNumber ;

    @NotBlank(message = "vehicleType is required")
    private String vehicleType ;

    @NotBlank(message = "vehicle make is required")
    private String make ;

    @NotBlank(message = "model is required")
    private String model ;
}
