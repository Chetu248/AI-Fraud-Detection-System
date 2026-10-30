package com.example.backend.dto.vehicle;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleResponse {

    private Long id ;

    private String registrationNumber ;

    private String vehicleType ;

    private String make ;

    private String model ;

    private String userId ;
}
