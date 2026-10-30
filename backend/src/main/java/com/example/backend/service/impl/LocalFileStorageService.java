package com.example.backend.service.impl;

import com.example.backend.exception.BadRequestException;
import com.example.backend.service.interfaces.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class LocalFileStorageService implements FileStorageService {

    private final Path rootLocation = Paths.get("uploads") ;

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        try {
            Files.createDirectories(rootLocation);
            String originalFileName = file.getOriginalFilename();
            String extension = "";

            if (originalFileName != null &&
                    originalFileName.contains(".")) {

                extension = originalFileName.substring(
                        originalFileName.lastIndexOf(".")
                );
            }

            String fileName = UUID.randomUUID() + extension;
            Path folderPath = rootLocation.resolve(folder);
            Files.createDirectories(folderPath);

            Path targetPath = folderPath.resolve(fileName);
            Files.copy(
                    file.getInputStream(),
                    targetPath
            );
            return folder + "/" + fileName;
        } catch(IOException ex) {
            throw new BadRequestException("failed to store file") ;
        }
    }

    @Override
    public void deleteFile(String fileKey) {
        try {
            Path filePath = rootLocation.resolve(fileKey) ;
            Files.deleteIfExists(filePath) ;
        } catch(IOException ex) {
            throw new BadRequestException("failed to delete file") ;
        }
    }
}
