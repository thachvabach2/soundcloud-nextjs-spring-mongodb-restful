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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.request.ReqLoginDTO;
import vn.bachdao.soundcloud.domain.dto.response.ResLoginDTO;
import vn.bachdao.soundcloud.security.SecurityUtils;
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

    public AuthenticateController(AuthenticationManagerBuilder authenticationManagerBuilder,
            SecurityUtils securityUtils, UserService userService) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtils = securityUtils;
        this.userService = userService;
    }

    @GetMapping("/login")
    @ApiMessage("User Login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDTO) {
        // Nạp input gồm username/password vào Security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDTO.getEmail(),
                loginDTO.getPassword());

        // Xác thực người dùng => cần viết hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // lưu vào Spring security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // create access token
        String access_token = this.securityUtils.createAccessToken(authentication);

        Optional<User> userOptional = this.userService.getUserByEmail(loginDTO.getEmail());
        User currUser = userOptional.get();

        ResLoginDTO res = new ResLoginDTO();
        ResLoginDTO.ResultResLoginDTO userResult = new ResLoginDTO.ResultResLoginDTO();
        userResult.setId(currUser.getId());
        userResult.setUserName("");
        userResult.setEmail(currUser.getEmail());
        userResult.setAddress(currUser.getAddress());
        userResult.setVerify(currUser.isVerify());
        userResult.setType("SYSTEM");
        userResult.setName(currUser.getName());
        userResult.setRole(currUser.getRole());

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
}