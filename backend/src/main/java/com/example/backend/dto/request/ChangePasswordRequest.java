package com.example.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChangePasswordRequest {

    @NotBlank(message = "current password is required")
    private String currentPassword ;

    @NotBlank(message = "new password is requires")
    @Size(min = 8 , message = "new password must be 8 character long")
    private String newPassword ;

    @NotBlank(message = "confirm passwords is required")
    private String confirmPassword ;
}
