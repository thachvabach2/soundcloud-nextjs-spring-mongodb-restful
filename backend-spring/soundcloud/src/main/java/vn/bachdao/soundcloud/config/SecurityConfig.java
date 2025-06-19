package vn.bachdao.soundcloud.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String[] AUTH_WHITELIST = {
            "/",
            "/api/v1/auth/login",
            "/tracks/**",
            "/api/v1/tracks/top",
            "/images/**",
            "/api/v1/auth/social-media"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http,
            CustomAuthenticationEntryPoint customAuthenticationEntryPoint) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(c -> c.disable())
                .formLogin(f -> f.disable())
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(AUTH_WHITELIST).permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults())
                        .authenticationEntryPoint(customAuthenticationEntryPoint))

                // xử lý exception (wrong bearer token)
                // .exceptionHandling(exceptions -> exceptions
                // .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint()) // 401
                // .accessDeniedHandler(new BearerTokenAccessDeniedHandler())) // 403

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
