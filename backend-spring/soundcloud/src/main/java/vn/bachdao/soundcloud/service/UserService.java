package vn.bachdao.soundcloud.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;

import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.domain.dto.response.user.ResGetUserDTO;
import vn.bachdao.soundcloud.domain.dto.response.user.ResUpdateUserDTO;
import vn.bachdao.soundcloud.repository.UserRepository;
import vn.bachdao.soundcloud.util.mapper.UserMapper;
import vn.bachdao.soundcloud.web.rest.errors.EmailAlreadyUsedException;

@Service
public class UserService {

    private final UserRepository userRepository;
    private ObjectMapper objectMapper;
    private MongoTemplate mongoTemplate;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, ObjectMapper objectMapper, MongoTemplate mongoTemplate,
            UserMapper userMapper) {
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
        this.mongoTemplate = mongoTemplate;
        this.userMapper = userMapper;
    }

    public User createUser(User user) {
        user.setIsVerify(true);
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

        List<ResGetUserDTO> users = this.userMapper.toResGetUserDTOs(userPage.getContent());

        res.setResult(users);
        res.setMeta(meta);

        return res;
    }

    public ResUpdateUserDTO updateAUser(User reqUser) throws EmailAlreadyUsedException {

        // Validate email
        validateEmailUnique(reqUser.getId(), reqUser.getEmail());

        Query query = new Query(Criteria.where("id").is(reqUser.getId()));

        // Tạo Update object
        Update update = new Update();

        // Convert reqUser to Map để dễ xử lý
        Map<String, Object> updateFields = objectMapper.convertValue(reqUser, Map.class);

        // Loại bỏ các field null
        updateFields.entrySet().stream()
                .filter(entry -> entry.getValue() != null)
                .filter(entry -> !entry.getKey().equals("password"))
                .forEach(entry -> update.set(entry.getKey(), entry.getValue()));

        // update DB
        UpdateResult updateResult = mongoTemplate.updateFirst(query, update, User.class);

        ResUpdateUserDTO res = new ResUpdateUserDTO();
        res.setAcknowledged(updateResult.wasAcknowledged());
        res.setModifiedCount(updateResult.getModifiedCount());
        res.setUpsertId(updateResult.getUpsertedId());
        res.setUpsertCount(updateResult.getUpsertedId() != null ? 1 : 0);
        res.setMatchedCount(updateResult.getMatchedCount());

        return res;
    }

    // Validate email update
    private void validateEmailUnique(String currentUserId, String email) throws EmailAlreadyUsedException {
        Query query = new Query(Criteria.where("email").is(email)
                .and("id").ne(currentUserId)); // Loại trừ user hiện tại

        boolean emailExists = mongoTemplate.exists(query, User.class);

        if (emailExists) {
            throw new EmailAlreadyUsedException("User với email = " + email + " đã tồn tại");
        }
    }

    public DeleteResult deleteAUser(String id) {
        this.userRepository.deleteById(id);
        return DeleteResult.acknowledged(1);
    }

    public Optional<User> getUserByEmail(String email) {
        return this.userRepository.findOneByEmailIgnoreCase(email);
    }

    public void updateUserToken(String token, String email) {
        User currentUser = this.getUserByEmail(email).get();
        if (currentUser != null) {
            currentUser.setRefreshToken(token);
            this.userRepository.save(currentUser);
        }
    }
}
