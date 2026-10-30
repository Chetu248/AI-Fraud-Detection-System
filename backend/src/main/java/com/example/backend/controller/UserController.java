package com.example.backend.controller;

import com.example.backend.dto.user.RoleUpdateRequest;
import com.example.backend.dto.user.UserProfileRequest;
import com.example.backend.dto.user.UserProfileResponse;
import com.example.backend.service.interfaces.UserProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserProfileService userProfileService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            Authentication authentication
    ) {

        Long userId =
                Long.valueOf(authentication.getName());

        return ResponseEntity.ok(
                userProfileService.getMyProfile(userId)
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid
            @RequestBody
            UserProfileRequest request,

            Authentication authentication
    ) {

        Long userId =
                Long.valueOf(authentication.getName());

        UserProfileResponse response =
                userProfileService.createOrUpdateProfile(
                        request,
                        userId
                );

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> updateUserRole(
            @PathVariable Long id,
            @Valid
            @RequestBody
            RoleUpdateRequest request
    ) {

        userProfileService.updateUserRole(
                id,
                request.getRole()
        );

        return ResponseEntity.ok().build();
    }
}