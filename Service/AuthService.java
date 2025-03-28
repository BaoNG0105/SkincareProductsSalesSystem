package com.example.SkinCareSellProductSysterm.Service;

import com.example.SkinCareSellProductSysterm.Entity.User;
import com.example.SkinCareSellProductSysterm.Repository.UserRepository;
import com.example.SkinCareSellProductSysterm.Utils.Role;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeRequestUrl;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String googleRedirectUri;

    @Value("${spring.security.oauth2.client.registration.google.user-info-uri}")
    private String googleUserInfoUri;

    public String loginWithGoogle() {
        GoogleAuthorizationCodeRequestUrl urlBuilder = new GoogleAuthorizationCodeRequestUrl(
                googleClientId,
                googleRedirectUri,
                Arrays.asList("email", "profile", "openid"));
        return urlBuilder.build();
    }

    @Transactional
    public String authenticateAndFetchProfile(String code) throws IOException {
        RestTemplate restTemplate = new RestTemplate();
        restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        String accessToken;
        accessToken = new GoogleAuthorizationCodeTokenRequest(
                new NetHttpTransport(), new GsonFactory(),
                googleClientId,
                googleClientSecret,
                code,
                googleRedirectUri
        ).execute().getAccessToken();

        // Đính kèm token
        restTemplate.getInterceptors().add((req, body, executionContext) -> {
            req.getHeaders().set("Authorization", "Bearer " + accessToken);
            return executionContext.execute(req, body);
        });

        Map<String, Object> userInfo = new ObjectMapper().readValue(
                restTemplate.getForEntity(googleUserInfoUri, String.class).getBody(),
                new TypeReference<>() {});

        String googleAccountId = (String) userInfo.get("sub");
        String email = (String) userInfo.get("email");
        String name = (String) userInfo.get("name");

        Optional<User> userExists = userRepository.findByEmail(email);
        User user;
        if(userExists.isEmpty()){
            user = User.builder()
                    .userName(name)
                    .passwordHash(passwordEncoder.encode("123456"))
                    .email(email)
                    .googleAccountId(googleAccountId)
                    .role(Role.Customer)
                    .createdAt(LocalDateTime.now())
                    .isDeleted(false)
                    .money(new BigDecimal(0))
                    .status(true)
                    .build();
            userRepository.save(user);
        }
        else{
            user = userExists.get();
            if(user.getGoogleAccountId() == null || user.getGoogleAccountId().isEmpty()){
                user.setGoogleAccountId(googleAccountId);
                userRepository.save(user);
            }
        }
        return jwtService.generateToken(user);
    }
}
