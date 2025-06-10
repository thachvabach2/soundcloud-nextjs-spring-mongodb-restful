package vn.bachdao.soundcloud.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourcesWebConfig implements WebMvcConfigurer {

    @Value("${soundcloud.upload.upload-file.base-uri}")
    private String baseURI;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/tracks/**")
                .addResourceLocations(baseURI + "/tracks");
        registry.addResourceHandler("/images/**")
                .addResourceLocations(baseURI + "/images");

    }
}
