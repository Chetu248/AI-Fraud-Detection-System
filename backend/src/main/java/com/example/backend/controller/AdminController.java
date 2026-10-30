package com.example.backend.controller;

import com.example.backend.dto.admin.AdminResponse;
import com.example.backend.service.interfaces.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/overview")
    public ResponseEntity<AdminResponse> getAdminOverview() {

        return ResponseEntity.ok(
                adminService.getAdminOverview()
        );
    }
}