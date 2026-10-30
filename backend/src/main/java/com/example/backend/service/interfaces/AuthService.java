package com.example.backend.service.interfaces;

import com.example.backend.dto.request.*;
import com.example.backend.dto.response.LoginResponse;
import com.example.backend.dto.response.RegisterResponse;

public interface AuthService {

    RegisterResponse register(RegisterRequest request) ;

    LoginResponse login(LoginRequest request) ;

    LoginResponse refreshToken(RefreshTokenRequest request) ;

    void logout(RefreshTokenRequest request) ;

    void changePassword(ChangePasswordRequest request) ;

    void forgetPassword(ForgotPasswordRequest request) ;

    void resetPassword(ResetPasswordRequest request) ;
}
