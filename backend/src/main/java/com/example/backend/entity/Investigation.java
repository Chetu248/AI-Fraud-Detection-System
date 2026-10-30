package com.example.backend.entity;

import com.example.backend.enums.InvestigationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "investigations")
public class Investigation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false, unique = true)
    private Claim claim ;

    @Column(length = 2000)
    private String reason ;

    @Column(length = 2000)
    private String findings ;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvestigationStatus status;

    private String investigator ;

    private LocalDateTime startedAt ;

    private LocalDateTime completedAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now() ;

        if(startedAt == null) {
            startedAt = LocalDateTime.now() ;
        }

        if(status == null) {
            status = InvestigationStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
