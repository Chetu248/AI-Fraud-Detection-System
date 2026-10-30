package com.example.backend.validation;

import com.example.backend.exception.BadRequestException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.Set;

@Component
public class DocumentFileValidator {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024 ;

    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of(
            "application/pdf",
            "image/jpeg",
            "image/png"
    );

    public void validate(MultipartFile file) {

        if(file == null || file.isEmpty()) {
            throw new BadRequestException("File cannot be empty") ;
        }

        if(file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("file size cannot exceed 10Mb") ;
        }

        String contentType = file.getContentType() ;

        if(contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType)) {
            throw new BadRequestException(
                    "unsupported file type. allowed types are : PDF , JPG , JPEG , PNG"
            ) ;
        }
    }
}
