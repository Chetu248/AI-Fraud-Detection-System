package com.example.backend.mapper;

import com.example.backend.dto.document.DocumentResponse;
import com.example.backend.entity.Document;
import org.springframework.stereotype.Component;

@Component
public class DocumentMapper {

    public DocumentResponse toResponse(Document document) {

        return DocumentResponse.builder()
                .id(document.getId())
                .claimId(document.getClaim().getId())
                .fileName(document.getFileName())
                .s3Key(document.getS3Key())
                .fileType(document.getFileType())
                .fileSize(document.getFileSize())
                .uploadedAt(document.getUploadedAt())
                .build();
    }
}
