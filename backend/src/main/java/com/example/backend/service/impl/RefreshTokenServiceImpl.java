package com.example.backend.service.impl;

import com.example.backend.entity.RefreshToken;
import com.example.backend.entity.User;
import com.example.backend.exception.InvalidRefreshTokenException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.RefreshTokenRepository;
import com.example.backend.service.interfaces.RefreshTokenService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository ;

    @Value("${jwt.refresh-token-expiration}")
    private long refreshTokenExpiration ;

    public RefreshTokenServiceImpl(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository ;
    }

    @Override
    public RefreshToken createRefreshToken(User user) {
        RefreshToken refreshToken = new RefreshToken() ;

        refreshToken.setToken(generateSecureToken()) ;

        refreshToken.setExpiryDate(LocalDateTime.now()
                .plusSeconds(refreshTokenExpiration / 1000));

        refreshToken.setUser(user) ;

        return refreshTokenRepository.save(refreshToken) ; 
    }

    private String generateSecureToken() {
        byte[] randomeBytes = new byte[64] ;

        SecureRandom secureRandom = new SecureRandom() ;
        secureRandom.nextBytes(randomeBytes) ;

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(randomeBytes) ;
    }

    @Override
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidRefreshTokenException(
                        "invalid refresh token"
                )) ;

        if(refreshToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(refreshToken) ;

            throw new InvalidRefreshTokenException(
                    "refresh token has expired"
            ) ;
        }

        return refreshToken ;
    }

    @Override
    public void deleteRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidRefreshTokenException(
                        "invalid refresh token"
                )) ;

        refreshTokenRepository.delete(refreshToken) ;
    }
}
