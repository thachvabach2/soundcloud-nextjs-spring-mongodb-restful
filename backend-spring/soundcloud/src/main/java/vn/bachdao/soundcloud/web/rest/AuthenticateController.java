package vn.bachdao.soundcloud.web.rest;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.request.auth.ReqLoginDTO;
import vn.bachdao.soundcloud.domain.dto.request.auth.ReqSocialLoginDTO;
import vn.bachdao.soundcloud.domain.dto.response.auth.ResLoginDTO;
import vn.bachdao.soundcloud.domain.dto.response.auth.ResSocialLoginDTO;
import vn.bachdao.soundcloud.security.SecurityUtils;
import vn.bachdao.soundcloud.service.AuthService;
import vn.bachdao.soundcloud.service.UserService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticateController {

    @Value("${soundcloud.security.authentication.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenValidityInSeconds;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtils securityUtils;
    private final UserService userService;
    private final AuthService authService;

    public AuthenticateController(
            AuthenticationManagerBuilder authenticationManagerBuilder,
            SecurityUtils securityUtils,
            UserService userService,
            AuthService authService) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtils = securityUtils;
        this.userService = userService;
        this.authService = authService;
    }

    @PostMapping("/login")
    @ApiMessage("User Login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDTO) {
        // Nạp input gồm username/password vào Security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDTO.getEmail(),
                loginDTO.getPassword());

        // Xác thực người dùng => cần viết hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject()
                .authenticate(authenticationToken);

        // lưu vào Spring security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Optional<User> userOptional = this.userService.getUserByEmail(loginDTO.getEmail());
        User currUser = userOptional.get();

        ResLoginDTO res = new ResLoginDTO();
        ResLoginDTO.ResultResLoginDTO userResult = new ResLoginDTO.ResultResLoginDTO();
        userResult.setId(currUser.getId());
        userResult.setUserName("");
        userResult.setEmail(currUser.getEmail());
        userResult.setAddress(currUser.getAddress());
        userResult.setIsVerify(currUser.getIsVerify());
        userResult.setType("SYSTEM");
        userResult.setName(currUser.getName());
        userResult.setRole(currUser.getRole());

        // create access token
        String access_token = this.securityUtils.createAccessToken(authentication, userResult);

        // create refresh token
        String refresh_token = this.securityUtils.createRefreshToken(loginDTO.getEmail(), userResult);
        // update user's refresh token in DB
        this.userService.updateUserToken(refresh_token, loginDTO.getEmail());

        res.setAccessToken(access_token);
        res.setRefreshToken(refresh_token);
        res.setUser(userResult);

        // set cookies
        ResponseCookie resCookies = ResponseCookie.from("refresh_token", refresh_token)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenValidityInSeconds)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(res);
    }

    @PostMapping("/social-media")
    @ApiMessage("Fetch token for user login with social media account")
    public ResponseEntity<ResSocialLoginDTO> socialLogin(@Valid @RequestBody ReqSocialLoginDTO req) {
        ResSocialLoginDTO res = this.authService.socialLogin(req);

        ResponseCookie resCookies = ResponseCookie.from("refresh_token", res.getRefreshToken())
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(refreshTokenValidityInSeconds)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, resCookies.toString())
                .body(res);
    }
}