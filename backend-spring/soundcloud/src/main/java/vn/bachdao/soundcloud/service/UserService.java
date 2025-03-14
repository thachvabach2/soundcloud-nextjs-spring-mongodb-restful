package vn.bachdao.soundcloud.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.mongodb.client.result.DeleteResult;

import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> getUserById(String id) {
        return this.userRepository.findById(id);
    }

    public List<User> getAllUser() {
        return this.userRepository.findAll();
    }

    public User updateAUser(User reqUser, User DbUser) {
        DbUser.setEmail(reqUser.getEmail());
        DbUser.setPassword(reqUser.getPassword());
        DbUser.setName(reqUser.getName());
        DbUser.setAge(reqUser.getAge());
        DbUser.setGender(reqUser.getGender());
        DbUser.setAddress(reqUser.getAddress());
        DbUser.setRole(reqUser.getRole());

        return this.userRepository.save(DbUser);
    }

    public DeleteResult deleteAUser(String id) {
        this.userRepository.deleteById(id);
        return DeleteResult.acknowledged(1);
    }
}
