package com.example.backend.service.impl;

import com.example.backend.dto.user.UserProfileRequest;
import com.example.backend.dto.user.UserProfileResponse;
import com.example.backend.entity.User;
import com.example.backend.entity.UserProfile;
import com.example.backend.enums.Role;
import com.example.backend.repository.UserProfileRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.interfaces.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserProfileServiceImpl implements UserProfileService {

    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getMyProfile(Long userId) {

        UserProfile profile =
                userProfileRepository.findByUserId(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "user profile not found"
                                )
                        );

        return mapToResponse(profile);
    }

    @Override
    @Transactional
    public UserProfileResponse createOrUpdateProfile(
            UserProfileRequest request,
            Long userId
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        UserProfile profile =
                userProfileRepository.findByUserId(userId)
                        .orElseGet(() -> {

                            UserProfile newProfile =
                                    new UserProfile();

                            newProfile.setUser(user);

                            return newProfile;
                        });

        profile.setDateOfBirth(
                request.getDateOfBirth()
        );

        profile.setAddress(
                request.getAddress()
        );

        profile.setCity(
                request.getCity()
        );

        profile.setState(
                request.getState()
        );

        profile.setPincode(
                request.getPincode()
        );

        UserProfile savedProfile =
                userProfileRepository.save(profile);

        return mapToResponse(savedProfile);
    }

    @Override
    @Transactional
    public void updateUserRole(
            Long userId,
            Role role) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"
                        )
                );

        user.setRole(role);

        userRepository.save(user);
    }

    private UserProfileResponse mapToResponse(
            UserProfile profile
    ) {

        UserProfileResponse response =
                new UserProfileResponse();

        response.setId(profile.getId());

        response.setUserId(
                profile.getUser().getId()
        );

        response.setDateOfBirth(
                profile.getDateOfBirth()
        );

        response.setAddress(
                profile.getAddress()
        );

        response.setCity(
                profile.getCity()
        );

        response.setState(
                profile.getState()
        );

        response.setPincode(
                profile.getPincode()
        );

        return response;
    }
}