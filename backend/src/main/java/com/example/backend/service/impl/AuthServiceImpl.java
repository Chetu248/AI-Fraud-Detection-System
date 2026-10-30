package com.example.backend.service.impl;

import com.example.backend.dto.request.*;
import com.example.backend.dto.response.LoginResponse;
import com.example.backend.dto.response.RegisterResponse;
import com.example.backend.entity.PasswordResetToken;
import com.example.backend.entity.RefreshToken;
import com.example.backend.entity.User;
import com.example.backend.enums.Role;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.service.JwtService;
import com.example.backend.service.interfaces.AuthService;
import com.example.backend.service.interfaces.PasswordResetTokenService;
import com.example.backend.service.interfaces.RefreshTokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository ;
    private final PasswordEncoder passwordEncoder ;
    private final AuthenticationManager authenticationManager ;
    private final JwtService jwtService ;
    private final RefreshTokenService refreshTokenService ;
    private final PasswordResetTokenService passwordResetTokenService ;

    public AuthServiceImpl(UserRepository userRepository ,
                           PasswordEncoder passwordEncoder ,
                           AuthenticationManager authenticationManager ,
                           JwtService jwtService ,
                           RefreshTokenService refreshTokenService ,
                           PasswordResetTokenService passwordResetTokenService) {
        this.userRepository = userRepository ;
        this.passwordEncoder = passwordEncoder ;
        this.authenticationManager = authenticationManager ;
        this.jwtService = jwtService ;
        this.refreshTokenService = refreshTokenService ;
        this.passwordResetTokenService = passwordResetTokenService ;
    }

    @Override
    public RegisterResponse register(RegisterRequest request) {

        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("email already exists") ;
        }

        User user = new User() ;

        user.setFirstName(request.getFirstName()) ;
        user.setLastName(request.getLastName()) ;
        user.setEmail(request.getEmail()) ;
        user.setPhoneNumber(request.getPhoneNumber()) ;

        user.setPassword(passwordEncoder.encode(request.getPassword())) ;

        user.setRole(Role.CUSTOMER) ;

        user.setActive(true) ;
        user.setEmailVerified(false) ;

        User savedUser = userRepository.save(user) ;

        RegisterResponse response = new RegisterResponse() ;

        response.setId(savedUser.getId()) ;
        response.setFirstName(savedUser.getFirstName()) ;
        response.setLastName(savedUser.getLastName()) ;
        response.setEmail(savedUser.getEmail()) ;
        response.setPhoneNumber(savedUser.getPhoneNumber()) ;
        response.setRole(savedUser.getRole()) ;
        response.setEmailVerified(savedUser.isEmailVerified()) ;

        return response ;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail() ,
                        request.getPassword()
                )
        ) ;

        UserDetails userDetails = (UserDetails) authentication.getPrincipal() ;

        User user = userRepository
                .findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("user not found")) ;

        // generated access token (short-lived)
        String accessToken = jwtService.generateAccessToken(
                user.getId() ,
                user.getEmail() ,
                user.getRole().name()
        ) ;

        // generate refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user) ;

        return new LoginResponse(
                accessToken ,
                refreshToken.getToken() ,
                "Bearer" ,
                user.getId() ,
                user.getEmail() ,
                user.getRole().name()
        ) ;
    }

    @Override
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(
                request.getRefreshToken()
        ) ;

        User user = refreshToken.getUser() ;

        String newAccessToken = jwtService.generateAccessToken(
                user.getId() ,
                user.getEmail() ,
                user.getRole().name()
        );

        return new LoginResponse(
                newAccessToken ,
                refreshToken.getToken() ,
                "Bearer" ,
                user.getId() ,
                user.getEmail(),
                user.getRole().name()
        ) ;
    }

    @Override
    public void logout(RefreshTokenRequest request) {
        refreshTokenService.deleteRefreshToken(
                request.getRefreshToken()
        );
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName() ;

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("user not found")) ;

        if(!passwordEncoder.matches(
                request.getCurrentPassword() ,
                user.getPassword())) {
            throw new RuntimeException("current password is incorrect") ;
        }

        if(!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("current password and confirmation password doesn't matched") ;
        }

        if(passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {
            throw  new RuntimeException("new password should be different from previous password") ;
        }

        user.setPassword(
                passwordEncoder.encode(request.getNewPassword())
        );

        userRepository.save(user) ;
    }

    @Override
    public void forgetPassword(ForgotPasswordRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException(
                        "user with email not found"
                )) ;

        PasswordResetToken resetToken = passwordResetTokenService
                .createToken(user) ;

        System.out.println("password reset token : " + resetToken.getToken()) ;
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword()
                .equals(request.getConfirmPassword())) {

            throw new RuntimeException(
                    "New password and confirm password do not match"
            );
        }

        PasswordResetToken resetToken =
                passwordResetTokenService.verifyToken(
                        request.getToken()
                );

        User user = resetToken.getUser();

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);

        passwordResetTokenService.deleteToken(
                request.getToken()
        );
    }


}
