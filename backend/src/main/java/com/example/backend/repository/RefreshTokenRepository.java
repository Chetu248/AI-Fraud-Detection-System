package com.example.backend.repository;

import com.example.backend.entity.RefreshToken;
import com.example.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken , Long> {

    Optional<RefreshToken> findByToken(String token) ;

    void deleteByUserId(User user) ;

    void deleteByToken(String token) ;
}
