package com.example.backend.service.interfaces;

import com.example.backend.dto.document.DocumentResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DocumentService {

    DocumentResponse uploadDocument(Long claimId , MultipartFile file) ;

    List<DocumentResponse> getDocumentsByClaimId(Long claimId) ;
}
