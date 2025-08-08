package vn.bachdao.soundcloud.repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import vn.bachdao.soundcloud.domain.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findOneByEmailIgnoreCase(String email);

    Optional<User> findOneByUsernameIgnoreCase(String username);

    @Query("?0")
    List<User> findAll(Document document);

    @Query("?0")
    Page<User> findAll(Document document, Pageable pageable);

    Optional<User> findOneByUsernameAndTypeAllIgnoreCase(String username, String type);

    Set<User> findByIdIn(Set<ObjectId> ids);

    Optional<User> findByRefreshTokenAndUsername(String refreshToken, String email);
}
