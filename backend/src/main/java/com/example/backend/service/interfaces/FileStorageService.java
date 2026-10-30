package com.example.backend.service.interfaces;

import org.springframework.web.multipart.MultipartFile;

public interface FileStorageService {

    String uploadFile(MultipartFile file , String folder) ;

    void deleteFile(String fileKey) ;
}
