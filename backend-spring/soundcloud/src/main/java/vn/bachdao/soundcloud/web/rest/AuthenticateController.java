package vn.bachdao.soundcloud.web.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.bachdao.soundcloud.domain.dto.request.ReqLoginDTO;

@RestController
@RequestMapping("/api/v1")
public class AuthenticateController {

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    public AuthenticateController(AuthenticationManagerBuilder authenticationManagerBuilder) {
        this.authenticationManagerBuilder = authenticationManagerBuilder;
    }

    @GetMapping("/login")
    public ResponseEntity<ReqLoginDTO> login(@RequestBody ReqLoginDTO loginDTO) {
        // Nạp input gồm username/password vào Security
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                loginDTO.getEmail(),
                loginDTO.getPassword());

        // Xác thực người dùng => cần viết hàm loadUserByUsername
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // lưu vào Spring security context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return ResponseEntity.ok(loginDTO);
    }
}
