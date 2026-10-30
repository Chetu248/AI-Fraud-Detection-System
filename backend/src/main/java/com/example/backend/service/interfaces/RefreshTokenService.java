package com.example.backend.service.interfaces;

import com.example.backend.entity.RefreshToken;
import com.example.backend.entity.User;

public interface RefreshTokenService {

    RefreshToken createRefreshToken(User user) ;

    RefreshToken verifyRefreshToken(String token) ;

    void deleteRefreshToken(String token) ;
}
