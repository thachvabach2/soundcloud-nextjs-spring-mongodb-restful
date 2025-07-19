package vn.bachdao.soundcloud.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.repository.UserRepository;

@Service
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> START INIT DATABASE");
        long countUsers = this.userRepository.count();

        if (countUsers == 0) {
            initAdmin();
        }

        if (countUsers > 0) {
            System.out.println(">>> SKIP INIT DATABASE ~ ALREADY HAVE DATA...");
        } else {
            System.out.println(">>> END INIT DATABASE");
        }
    }

    private void initAdmin() {
        User admin = new User(null,
                "admin@gmail.com",
                "admin@gmail.com",
                this.passwordEncoder.encode("123456"),
                true,
                "SYSTEM",
                "I'm super admin",
                25,
                "MALE",
                "hà nội",
                "ADMIN",
                null);

        this.userRepository.insert(admin);
        System.out.println(">>> INIT USER SUCCEED !...");
    }
}