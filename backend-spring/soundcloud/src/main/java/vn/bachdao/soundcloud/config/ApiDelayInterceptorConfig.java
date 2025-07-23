package vn.bachdao.soundcloud.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApiDelayInterceptorConfig implements WebMvcConfigurer {
    @Bean
    ApiDelayInterceptor getApiDelayInterceptor() {
        return new ApiDelayInterceptor();
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        String[] whiteList = {
                // "/", "/api/v1/auth/**"
        };
        registry.addInterceptor(getApiDelayInterceptor())
                .addPathPatterns("/api/**", "**")
                .excludePathPatterns(whiteList);
    }
}