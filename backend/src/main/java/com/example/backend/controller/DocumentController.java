package com.example.backend.controller;

import com.example.backend.dto.document.DocumentResponse;
import com.example.backend.service.interfaces.DocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/claims")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService ;

    @PostMapping("/{id}/documents")
    public ResponseEntity<DocumentResponse> uploadDocument(
            @PathVariable Long id ,
            @RequestParam("file")MultipartFile file) {

        DocumentResponse response = documentService.uploadDocument(id , file) ;

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response) ;
    }

    @GetMapping("/{id}/documents")
    public ResponseEntity<List<DocumentResponse>> getDocuments(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                documentService.getDocumentsByClaimId(id)
        ) ;
    }
}
