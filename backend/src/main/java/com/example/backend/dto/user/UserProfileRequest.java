package com.example.backend.dto.user;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileRequest {

    private String dateOfBirth ;

    private String address ;

    private String city ;

    private String state ;

    @Size(max = 10 , message = "pincode can't exceed 10 digits")
    private String pincode ;
}
