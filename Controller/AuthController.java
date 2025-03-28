package com.example.SkinCareSellProductSysterm.Controller;


import com.example.SkinCareSellProductSysterm.Service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;


    @GetMapping("/login-with-google")
    public ResponseEntity<?> loginWithGoogle(){
        String url = authService.loginWithGoogle();
        return new ResponseEntity<>(url, HttpStatus.OK);
    }

    @GetMapping("/login-with-google/callback")
    public ResponseEntity<?> googleCallback(@RequestParam("code") String code) throws IOException {
        return new ResponseEntity<>(authService.authenticateAndFetchProfile(code), HttpStatus.OK);
    }
}

