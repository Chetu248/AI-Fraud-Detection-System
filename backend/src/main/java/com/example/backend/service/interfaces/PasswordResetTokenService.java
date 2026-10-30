package com.example.backend.service.interfaces;

import com.example.backend.entity.PasswordResetToken;
import com.example.backend.entity.User;

import java.util.Optional;

public interface PasswordResetTokenService {

    PasswordResetToken createToken(User user) ;

    PasswordResetToken verifyToken(String token) ;

    void deleteToken(String token) ;

}
