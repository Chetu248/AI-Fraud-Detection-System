package com.example.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "refresh_tokens" ,
        indexes = {
                @Index(name = "idx_refresh_token" , columnList = "token")
        }
)
public class RefreshToken extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @Column(nullable = false , unique = true , length = 500)
    private String token ;

    @Column(nullable = false)
    private LocalDateTime expiryDate ;

    @ManyToOne(fetch = FetchType.LAZY , optional = false)
    @JoinColumn(
            name = "user_id" ,
            nullable = false ,
            foreignKey = @ForeignKey(name = "fk_refresh_token_user")
    )
    private User user ;

    public RefreshToken() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}
