package com.example.backend.dto.document;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentResponse {

    private Long id ;

    private Long claimId ;

    private String fileName ;

    private String s3Key ;

    private String fileType ;

    private Long fileSize ;

    private LocalDateTime uploadedAt ;
}
