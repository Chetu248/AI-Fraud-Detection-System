package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RoleTestController {

    @GetMapping("/test/customer")
    public String customerEndPoint() {
        return "Customer endpoint accessed success" ;
    }

    @GetMapping("/test/investigator")
    public String investEndPoint() {
        return "Investigator endpoint accessed success" ;
    }

    @GetMapping("/test/admin")
    public String adminEndPoint() {
        return "admin endpint accessed success" ;
    }
}
