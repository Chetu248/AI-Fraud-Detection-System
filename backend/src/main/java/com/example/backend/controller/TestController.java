package com.example.backend.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test/protected")
    public String protectedEndpoint(Authentication authentication) {
        return "hello" + authentication.getName() + " you are authenticated" ;
    }
}
