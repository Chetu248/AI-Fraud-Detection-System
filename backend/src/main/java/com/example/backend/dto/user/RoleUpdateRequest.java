package com.example.backend.dto.user;

import com.example.backend.enums.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleUpdateRequest {

    @NotNull(message = "Role is required")
    private Role role;
}