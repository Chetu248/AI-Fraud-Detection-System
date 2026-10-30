package com.example.backend.service.impl;

import com.example.backend.dto.document.DocumentResponse;
import com.example.backend.entity.Claim;
import com.example.backend.entity.Document;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.DocumentMapper;
import com.example.backend.repository.ClaimRepository;
import com.example.backend.repository.DocumentRepository;
import com.example.backend.service.interfaces.DocumentService;
import com.example.backend.service.interfaces.FileStorageService;
import com.example.backend.validation.DocumentFileValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final ClaimRepository claimRepository;
    private final DocumentMapper documentMapper;
    private final FileStorageService fileStorageService;
    private final DocumentFileValidator documentFileValidator ;


    @Override
    public DocumentResponse uploadDocument(Long claimId, MultipartFile file) {

        documentFileValidator.validate(file) ;

        Claim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new ResourceNotFoundException("claim not found")) ;

        String s3Key = fileStorageService.uploadFile(
                file ,
                "claims/" + claimId + "/documents"
        ) ;

        Document document = Document.builder()
                .claim(claim)
                .fileName(file.getOriginalFilename())
                .s3Key(s3Key)
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .uploadedAt(LocalDateTime.now())
                .build();

        Document savedDocument = documentRepository.save(document) ;

        return documentMapper.toResponse(savedDocument) ;
    }

    @Override
    public List<DocumentResponse> getDocumentsByClaimId(Long claimId) {
        return documentRepository.findByClaimId(claimId)
                .stream()
                .map(documentMapper::toResponse)
                .toList() ;
    }
}
