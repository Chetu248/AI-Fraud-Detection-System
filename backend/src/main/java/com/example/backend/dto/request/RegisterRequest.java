package com.example.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {

    @NotBlank(message = "First Name is required")
    @Size(max = 100 , message = "first name should not exceed 100 characters")
    private String firstName ;

    @NotBlank(message = "Last Name is required")
    @Size(max = 100 , message = "last name should not exceed 100 characters")
    private String lastName ;

    @NotBlank(message = "Email is required")
    @Email(message = "provide a valid email")
    @Size(max = 150 , message = "email should not exceed 150 characters")
    private String email ;

    @NotBlank(message = "password must not be blank")
    @Size(min = 8 , max = 20 , message = "password must be between 8 to 20 character")
    private String password ;

    @NotBlank(message = "phone num is required")
    @Pattern(
            regexp = "^[0-9]{10}$" ,
            message = "phone number must contain exactly 10 digits"
    )
    private String phoneNumber ;

    public RegisterRequest(){}

}
