package vn.bachdao.soundcloud.security;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.util.Base64;

import vn.bachdao.soundcloud.domain.dto.response.auth.ResLoginDTO;
import vn.bachdao.soundcloud.domain.dto.response.auth.ResSocialLoginDTO;
import vn.bachdao.soundcloud.web.rest.errors.UserNotAuthenticatedException;

@Service
public class SecurityUtils {
    public static final MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS512;

    private final JwtEncoder jwtEncoder;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${soundcloud.security.authentication.jwt.base64-secret}")
    private String jwtKey;

    @Value("${soundcloud.security.authentication.jwt.access-token-validity-in-seconds}")
    private long accessTokenValidityInSeconds;

    @Value("${soundcloud.security.authentication.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenValidityInSeconds;

    public SecurityUtils(JwtEncoder jwtEncoder) {
        this.jwtEncoder = jwtEncoder;
    }

    public String createAccessToken(Authentication authentication, ResLoginDTO.ResultResLoginDTO dto) {
        String authorities = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(" "));
        Instant now = Instant.now();

        Instant validity = now.plus(this.accessTokenValidityInSeconds, ChronoUnit.SECONDS);

        ResLoginDTO.UserInsideToken userInsideToken = new ResLoginDTO.UserInsideToken();
        userInsideToken.set_id(dto.getId());
        userInsideToken.setUsername(dto.getUserName());
        userInsideToken.setEmail(dto.getEmail());
        userInsideToken.setName(dto.getName());
        userInsideToken.setIsVerify(dto.getIsVerify());
        userInsideToken.setRole(dto.getRole());
        userInsideToken.setType(dto.getType());

        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(validity)
            .subject(userInsideToken.get_id())
            .claim("user", userInsideToken)
            .claim("auth", authorities)
            .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();

        // signature = jwk + jwsHeader(header) + claims(payload)
        // jwk = jwtKey(secret key) + alg
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public String createAccessSocialToken(ResSocialLoginDTO.ResultResSocialLoginDTO dto) {
        Instant now = Instant.now();

        Instant validity = now.plus(this.accessTokenValidityInSeconds, ChronoUnit.SECONDS);

        ResSocialLoginDTO.UserInsideSocialToken userInsideToken = new  ResSocialLoginDTO.UserInsideSocialToken();
        userInsideToken.set_id(dto.getId());
        userInsideToken.setUsername(dto.getUsername());
        userInsideToken.setEmail(dto.getEmail());
        userInsideToken.setName(dto.getName());
        userInsideToken.setIsVerify(dto.getIsVerify());
        userInsideToken.setRole(dto.getRole());
        userInsideToken.setType(dto.getType());

        // @formatter:off
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(validity)
            .subject(userInsideToken.get_id())
            .claim("user", userInsideToken)
            .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();

        // signature = jwk + jwsHeader(header) + claims(payload)
        // jwk = jwtKey(secret key) + alg
        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public String createRefreshToken(String username, ResLoginDTO.ResultResLoginDTO dto) {
        Instant now = Instant.now();
        Instant validity = now.plus(this.refreshTokenValidityInSeconds, ChronoUnit.SECONDS);

        ResLoginDTO.UserInsideToken userInsideToken = new ResLoginDTO.UserInsideToken();
        userInsideToken.set_id(dto.getId());
        userInsideToken.setUsername(dto.getUserName());
        userInsideToken.setEmail(dto.getEmail());
        userInsideToken.setName(dto.getName());
        userInsideToken.setIsVerify(dto.getIsVerify());
        userInsideToken.setRole(dto.getRole());
        userInsideToken.setType(dto.getType());

        // payload
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(validity)
                .subject(userInsideToken.get_id())
                .claim("user", userInsideToken)
                .build();

        // header
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    public String createRefreshSocialToken(ResSocialLoginDTO.ResultResSocialLoginDTO dto) {
        Instant now = Instant.now();
        Instant validity = now.plus(this.refreshTokenValidityInSeconds, ChronoUnit.SECONDS);

        ResSocialLoginDTO.UserInsideSocialToken userInsideToken = new  ResSocialLoginDTO.UserInsideSocialToken();
        userInsideToken.set_id(dto.getId());
        userInsideToken.setUsername(dto.getUsername());
        userInsideToken.setEmail(dto.getEmail());
         userInsideToken.setName(dto.getName());
        userInsideToken.setIsVerify(dto.getIsVerify());
        userInsideToken.setRole(dto.getRole());
        userInsideToken.setType(dto.getType());

        // payload
        JwtClaimsSet claims = JwtClaimsSet.builder()
            .issuedAt(now)
            .expiresAt(validity)
            .subject(userInsideToken.get_id())
            .claim("user", userInsideToken)
            .build();

        // header
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();

        return this.jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
    }

    private SecretKey getSecretKey() {
        byte[] keyBytes = Base64.from(jwtKey).decode();
        return new SecretKeySpec(keyBytes, 0, keyBytes.length, JWT_ALGORITHM.getName());
    }

    public Jwt checkValidRefreshToken(String token) throws UserNotAuthenticatedException {
        NimbusJwtDecoder jwtDecoder = NimbusJwtDecoder.withSecretKey(
                getSecretKey()).macAlgorithm(JWT_ALGORITHM).build();
        try {
            return jwtDecoder.decode(token);
        } catch (Exception e) {
            throw new UserNotAuthenticatedException("Refresh_token không hợp lệ hoặc đã hết hạn");
        }
    }

    public static Optional<String> getCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractPrincipal(securityContext.getAuthentication()));
    }

    private static String extractPrincipal(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof UserDetails springSecurityUser) {
            return springSecurityUser.getUsername();
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getSubject();
        } else if (authentication.getPrincipal() instanceof String s) {
            return s;
        }
        return null;
    }

    public static Optional<Map<String, Object>> getClaimUserFromTokenCurrentUserLogin() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractClaimUser(securityContext.getAuthentication()));
    }

    private static Map<String, Object> extractClaimUser(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            return jwt.getClaimAsMap("user");
        }
        return null;
    }

     public static Optional<ResLoginDTO.UserInsideToken> getClaimUserFromTokenCurrentUserLogin1() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return Optional.ofNullable(extractClaimUser1(securityContext.getAuthentication()));
    }

    private static ResLoginDTO.UserInsideToken extractClaimUser1(Authentication authentication) {
        if (authentication == null) {
            return null;
        } else if (authentication.getPrincipal() instanceof Jwt jwt) {
            Object userClaim = jwt.getClaim("user");
            if (userClaim != null) {
                return objectMapper.convertValue(userClaim, ResLoginDTO.UserInsideToken.class);
            }
        }
        return null;
    }
}