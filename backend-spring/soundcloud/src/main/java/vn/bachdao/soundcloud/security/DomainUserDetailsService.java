package vn.bachdao.soundcloud.security;

import java.util.Collections;
import java.util.Optional;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import vn.bachdao.soundcloud.repository.UserRepository;

@Component("userDetailsService")
public class DomainUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public DomainUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        Optional<vn.bachdao.soundcloud.domain.User> userOptional = this.userRepository
                .findOneByUsernameIgnoreCase(username);

        // handle username not exist in DB -> BadCredentialsException("Bad credentials")
        if (userOptional.isEmpty()) {
            throw new UsernameNotFoundException("Username/password không hợp lệ");
        }

        return new User(
                userOptional.get().getUsername(),
                userOptional.get().getPassword(),
                Collections.singleton(new SimpleGrantedAuthority("ROLE_" + userOptional.get().getRole())));
    }

}
