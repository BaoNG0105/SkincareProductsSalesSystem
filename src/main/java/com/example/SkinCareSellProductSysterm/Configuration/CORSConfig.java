package com.example.SkinCareSellProductSysterm.Configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CORSConfig implements WebMvcConfigurer {

    // Ghi đè phương thức để cấu hình CORS (Cross-Origin Resource Sharing)
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Áp dụng cho tất cả các đường dẫn API
                .allowedOrigins("*") // Cho phép tất cả các nguồn (origin) truy cập
                .allowedHeaders("*") // Cho phép tất cả các headers
                .exposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Methods", "Access-Control-Allow-Headers")
                // Các headers này sẽ được client nhìn thấy
                .allowedMethods("*") // Cho phép tất cả các phương thức HTTP (GET, POST, PUT, DELETE, ...)
                .maxAge(1440000); // Thời gian tối đa (giây) mà trình duyệt nhớ kết quả của CORS (cache)
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/static/**") // Định nghĩa đường dẫn truy cập tài nguyên tĩnh
                .addResourceLocations("classpath:/static/"); // Chỉ định vị trí thực tế của tài nguyên trong thư mục static của classpath
    }
}
