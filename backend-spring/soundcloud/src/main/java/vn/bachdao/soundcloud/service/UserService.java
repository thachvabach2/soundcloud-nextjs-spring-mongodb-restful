package vn.bachdao.soundcloud.service;

import java.util.Optional;

import org.bson.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.mongodb.client.result.DeleteResult;

import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        user.setVerify(true);
        return userRepository.save(user);
    }

    public Optional<User> getUserById(String id) {
        return this.userRepository.findById(id);
    }

    public ResPaginationDTO getAllUser(Document document, Pageable pageable) {
        Page<User> userPage = this.userRepository.findAll(document, pageable);

        ResPaginationDTO res = new ResPaginationDTO();
        ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();
        meta.setPageNumber(userPage.getNumber() + 1);
        meta.setPageSize(userPage.getSize());
        meta.setTotalPage(userPage.getTotalPages());
        meta.setTotalElement(userPage.getTotalElements());

        res.setResult(userPage.getContent());
        res.setMeta(meta);

        return res;
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

    public Optional<User> getUserByEmail(String email) {
        return this.userRepository.findOneByEmailIgnoreCase(email);
    }
}
