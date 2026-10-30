package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claim_id", nullable = false)
    private Claim claim ;

    @Column(nullable = false)
    private String fileName ;

    @Column(nullable = false)
    private String s3Key ;

    @Column(nullable = false)
    private String fileType ;

    @Column(nullable = false)
    private Long fileSize ;

    @Column(nullable = false)
    private LocalDateTime uploadedAt ;
}
