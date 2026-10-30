package com.example.backend.entity;

import com.example.backend.enums.ClaimStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "claims")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Claim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle ;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal claimAmount ;

    @Column(nullable = false, length = 1000)
    private String description ;

    @Column(nullable = false)
    private LocalDateTime claimDate ;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status ;
}
