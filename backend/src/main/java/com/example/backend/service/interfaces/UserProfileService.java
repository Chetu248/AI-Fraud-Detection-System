package com.example.backend.service.interfaces;

import com.example.backend.dto.user.UserProfileRequest;
import com.example.backend.dto.user.UserProfileResponse;
import com.example.backend.enums.Role;

public interface UserProfileService {

    UserProfileResponse getMyProfile(Long userId) ;

    UserProfileResponse createOrUpdateProfile(UserProfileRequest request ,
                                              Long userId) ;

    void updateUserRole(Long userId , Role role) ;
}
