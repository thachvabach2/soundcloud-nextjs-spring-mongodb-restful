package vn.bachdao.soundcloud.web.rest;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.config.Constants;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.request.auth.ReqLoginDTO;
import vn.bachdao.soundcloud.domain.dto.request.auth.ReqSocialLoginDTO;
import vn.bachdao.soundcloud.domain.dto.response.auth.ResLoginDTO;
import vn.bachdao.soundcloud.domain.dto.response.auth.ResSocialLoginDTO;
import vn.bachdao.soundcloud.security.SecurityUtils;
import vn.bachdao.soundcloud.service.AuthService;
import vn.bachdao.soundcloud.service.UserService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;
import vn.bachdao.soundcloud.web.rest.errors.UserNotAuthenticatedException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticateController {

    @Value("${soundcloud.security.authentication.jwt.refresh-token-validity-in-seconds}")
    private long refreshTokenValidityInSeconds;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final SecurityUtils securityUtils;
    private final UserService userService;
    private final AuthService authService;
    private final ObjectMapper objectMapper;

    public AuthenticateController(
            AuthenticationManagerBuilder authenticationManagerBuilder,
            SecurityUtils securityUtils,
            UserService userService,
            AuthService authService,
            ObjectMapper objectMapper) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
        this.securityUtils = securityUtils;
        this.userService = userService;
        this.authService = authService;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/login")
    @ApiMessage("User Login")
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDTO) {
        // Nạp input gồm username/password vào Security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDTO.getUsername(),
                loginDTO.getPassword());

        // Xác thực người dùng => cần viết hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject()
                .authenticate(authenticationToken);

        // lưu vào Spring security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Optional<User> userOptional = this.userService.getUserByUsername(loginDTO.getUsername());
        User currUser = userOptional.get();

        ResLoginDTO res = new ResLoginDTO();
        ResLoginDTO.ResultResLoginDTO userResult = new ResLoginDTO.ResultResLoginDTO();
        userResult.setId(currUser.getId());
        userResult.setUserName(currUser.getUsername());
        userResult.setEmail(currUser.getEmail());
        userResult.setAddress(currUser.getAddress());
        userResult.setIsVerify(currUser.getIsVerify());
        userResult.setType(Constants.SYSTEM);
        userResult.setName(currUser.getName());
        userResult.setRole(currUser.getRole());

        // create access token
        String access_token = this.securityUtils.createAccessToken(authentication, userResult);

        // create refresh token
        String refresh_token = this.securityUtils.createRefreshToken(loginDTO.getUsername(), userResult);
        // update user's refresh token in DB
        this.userService.updateUserToken(refresh_token, loginDTO.getUsername());

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

    @PostMapping("/refresh")
    @ApiMessage("Get new token (refresh)")
    public ResponseEntity<ResLoginDTO> createNewAccessTokenFromRefreshToken(
            @RequestBody Map<String, String> req)
            throws UserNotAuthenticatedException, IdInvalidException {
        String refresh_token = req.get("refresh_token");
        // Check valid
        Jwt decodedToken = this.securityUtils.checkValidRefreshToken(refresh_token);
        Object userClaim = decodedToken.getClaim("user");
        if (userClaim == null) {
            throw new UserNotAuthenticatedException("Không có claim user trong refresh token");
        }
        ResLoginDTO.UserInsideToken userInsideToken = objectMapper.convertValue(userClaim,
                ResLoginDTO.UserInsideToken.class);
        String username = userInsideToken.getUsername();

        // check user by token + email
        User currentUser = this.userService.getUserByRefreshTokenAndUsername(refresh_token, username);
        if (currentUser == null) {
            throw new UserNotAuthenticatedException("Refresh Token không hợp lệ");
        }

        // issue new token/set refresh token as cookies
        ResLoginDTO res = new ResLoginDTO();
        User currentUserDB = this.userService.handleGetUserByUsername(username);
        ResLoginDTO.ResultResLoginDTO userLogin = null;
        if (currentUserDB != null) {
            userLogin = new ResLoginDTO.ResultResLoginDTO(
                    currentUserDB.getId(),
                    currentUserDB.getUsername(),
                    currentUserDB.getEmail(),
                    currentUserDB.getAddress(),
                    currentUserDB.getIsVerify(),
                    currentUserDB.getType(),
                    currentUserDB.getName(),
                    currentUser.getRole());
            res.setUser(userLogin);
        }

        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userLogin.getUserName(), null,
                List.of(new SimpleGrantedAuthority("ROLE_" + userLogin.getRole())));

        // create access token
        String access_token = this.securityUtils.createAccessToken(authentication, userLogin);
        res.setAccessToken(access_token);

        // create refresh token
        String new_refresh_token = this.securityUtils.createRefreshToken(userLogin.getUserName(), userLogin);
        res.setRefreshToken(new_refresh_token);

        // update user
        this.userService.updateUserToken(new_refresh_token, username);

        // set cookies
        ResponseCookie resCookies = ResponseCookie.from("refresh_token", new_refresh_token)
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