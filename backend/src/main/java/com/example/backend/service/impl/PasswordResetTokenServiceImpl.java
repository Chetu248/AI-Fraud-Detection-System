package com.example.backend.service.impl;

import com.example.backend.entity.PasswordResetToken;
import com.example.backend.entity.User;
import com.example.backend.repository.PasswordResetTokenRepository;
import com.example.backend.service.interfaces.PasswordResetTokenService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetTokenServiceImpl
        implements PasswordResetTokenService {

    private final PasswordResetTokenRepository tokenRepository;

    public PasswordResetTokenServiceImpl(
            PasswordResetTokenRepository tokenRepository) {

        this.tokenRepository = tokenRepository;
    }

    @Override
    @Transactional
    public PasswordResetToken createToken(User user) {

        tokenRepository.deleteByUserId(user.getId());

        PasswordResetToken resetToken =
                new PasswordResetToken();

        resetToken.setToken(
                UUID.randomUUID().toString()
        );

        resetToken.setUser(user);

        resetToken.setExpiryDate(
                LocalDateTime.now().plusMinutes(15)
        );

        return tokenRepository.save(resetToken);
    }

    @Override
    public PasswordResetToken verifyToken(String token) {

        PasswordResetToken resetToken =
                tokenRepository.findByToken(token)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid password reset token"
                                )
                        );

        if (resetToken.getExpiryDate()
                .isBefore(LocalDateTime.now())) {

            tokenRepository.delete(resetToken);

            throw new RuntimeException(
                    "Password reset token has expired"
            );
        }

        return resetToken;
    }

    @Override
    public void deleteToken(String token) {

        tokenRepository.findByToken(token)
                .ifPresent(tokenRepository::delete);
    }
}