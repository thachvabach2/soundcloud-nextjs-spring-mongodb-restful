package vn.bachdao.soundcloud.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import vn.bachdao.soundcloud.config.Constants;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.request.auth.ReqSocialLoginDTO;
import vn.bachdao.soundcloud.domain.dto.response.auth.ResSocialLoginDTO;
import vn.bachdao.soundcloud.repository.UserRepository;
import vn.bachdao.soundcloud.security.SecurityUtils;
import vn.bachdao.soundcloud.util.mapper.UserMapper;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final SecurityUtils securityUtils;

    public AuthService(UserRepository userRepository, UserMapper userMapper, SecurityUtils securityUtils,
            UserService userService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.securityUtils = securityUtils;
    }

    public ResSocialLoginDTO socialLogin(ReqSocialLoginDTO req) {
        Optional<User> existingUser = userRepository.findOneByUsernameAndTypeAllIgnoreCase(
                req.getUsername(),
                req.getType());
        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
        } else {
            user = createNewSocialUser(req);
        }

        ResSocialLoginDTO res = new ResSocialLoginDTO();
        ResSocialLoginDTO.ResultResSocialLoginDTO userResult = this.userMapper.toResultResSocialLoginDTO(user);

        String access_token = this.securityUtils.createAccessSocialToken(userResult);
        String refresh_token = this.securityUtils.createRefreshSocialToken(userResult);

        user.setRefreshToken(refresh_token);
        this.userRepository.save(user);

        res.setAccessToken(access_token);
        res.setRefreshToken(refresh_token);
        res.setUser(userResult);

        return res;
    }

    private User createNewSocialUser(ReqSocialLoginDTO req) {
        User newUser = new User();
        newUser.setUsername(req.getUsername());
        newUser.setEmail(req.getUsername());
        newUser.setType(req.getType());
        newUser.setRole(Constants.ROLE_USER);

        return this.userRepository.save(newUser);
    }
}
