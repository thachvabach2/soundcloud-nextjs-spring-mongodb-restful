package vn.bachdao.soundcloud.web.rest;

import java.util.Optional;

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

@RestController
@RequestMapping("/api/v1/auth")
public class AuthenticateController {

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
    public ResponseEntity<ResLoginDTO> login(@Valid @RequestBody ReqLoginDTO loginDTO) {
        // Nạp input gồm username/password vào Security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDTO.getEmail(),
                loginDTO.getPassword());

        // Xác thực người dùng => cần viết hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // lưu vào Spring security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // create token
        String access_token = this.securityUtils.createAccessToken(authentication);

        Optional<User> userOptional = this.userService.getUserByEmail(loginDTO.getEmail());

        ResLoginDTO res = new ResLoginDTO();
        ResLoginDTO.ResultResLoginDTO result = new ResLoginDTO.ResultResLoginDTO();
        result.setId(userOptional.get().getId());
        result.setCreatedAt(userOptional.get().getCreatedAt());

        res.setAccessToken(access_token);
        res.setResult(result);

        return ResponseEntity.ok(res);
    }
}