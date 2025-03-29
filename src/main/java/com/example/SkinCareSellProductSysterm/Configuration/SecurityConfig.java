package com.example.SkinCareSellProductSysterm.Configuration;


import com.example.SkinCareSellProductSysterm.Filter.JwtAuthenticationFilter;
import com.example.SkinCareSellProductSysterm.mapper.OrderMapper;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
//        http.csrf(AbstractHttpConfigurer::disable) // Tắt giao diện form login
//                // Request đi qua bộ lọc này trước
//                .cors().and()
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // xác thực
//                .authorizeHttpRequests(requests -> { // phân quyền
//                    requests
//                            .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
//                            .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
//                            .requestMatchers(HttpMethod.GET, "/api/auth/login-with-google").permitAll()
//                            .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
//                            .requestMatchers(HttpMethod.GET, "/api/users/{id}").permitAll()
//                            .requestMatchers(HttpMethod.GET, "/api/auth/login-with-google/callback").permitAll()
//                            .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
//                            .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
//                            .requestMatchers(HttpMethod.GET, "/api/products/{id}").permitAll()
//                            .requestMatchers(HttpMethod.POST, "/api/products/**").permitAll()
//                            .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
//                            .requestMatchers(HttpMethod.GET, "/api/promotions/**").permitAll()
//                            .requestMatchers(HttpMethod.POST, "/api/promotions/**").permitAll()
//                            .requestMatchers(HttpMethod.GET, "/api/blogs/**").permitAll()
//                            .requestMatchers(HttpMethod.POST, "/api/blogs/**").permitAll()
//                            .anyRequest().authenticated(); // Các api khác chỉ cần đăng nhập là call được
//                });
//        return http.build();
//    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Tắt CSRF
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // Thêm JWT filter
                .authorizeHttpRequests(auth -> auth
                                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/auth/login-with-google").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/users/**").permitAll()
                                .requestMatchers(HttpMethod.PUT, "/api/users/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/users/**").permitAll()
//                        .requestMatchers(HttpMethod.GET, "/api/users/password/{id}").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/auth/login-with-google/callback").permitAll()
                                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/products/**").permitAll()
                                .requestMatchers(HttpMethod.PUT, "/api/products/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/promotions/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/promotions/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/blogs/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/blogs/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/order-items/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/order-items/**").permitAll()
                                .requestMatchers(HttpMethod.PUT, "/api/order-items/**").permitAll()
                                .requestMatchers(HttpMethod.DELETE, "/api/order/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/order/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/order/**").permitAll()
                                .requestMatchers(HttpMethod.PUT, "/api/order/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/skin-types/**").permitAll()
                                .requestMatchers(HttpMethod.DELETE, "/api/order-items/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/test-result/**").permitAll()
                                .requestMatchers(HttpMethod.POST, "/api/test-result/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/skin-care-routines/**").permitAll()
                                .requestMatchers(HttpMethod.GET, "/api/recommended-products/**").permitAll()
                                .anyRequest().authenticated() // Các API khác yêu cầu xác thực
                )
                .cors(withDefaults()); // Sử dụng cấu hình CORS mặc định

        return http.build();
    }


    // 403 => vào đây kiểm tra

    // Dùng cho Order
    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper(); // Tạo instance đúng cách
        modelMapper.addMappings(new OrderMapper()); // Thêm mapping
        return modelMapper;
    }
}
