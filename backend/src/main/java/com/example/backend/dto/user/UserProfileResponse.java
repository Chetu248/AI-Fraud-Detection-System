package com.example.backend.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfileResponse {

    private Long id ;

    private Long userId ;

    private String dateOfBirth ;

    private String address ;

    private String city ;

    private String state ;

    private String pincode ;
}
