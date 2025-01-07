package com.student.perf.EduTrack.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {

        @Bean
        public WebMvcConfigurer corsConfigurer() {
            return new WebMvcConfigurer() {
                @Override
                public void addCorsMappings(CorsRegistry registry) {
                    registry.addMapping("/**")
                            .allowedOrigins("http://localhost:3000")
                            .allowedMethods("GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS")
                            .allowedHeaders("*") // Accept all headers
                            .exposedHeaders("Authorization") // Allow Authorization in response headers
                            .allowCredentials(true)
                            .maxAge(3600); // Cache preflight response for 1 hour

                }
            };
        }
    }
