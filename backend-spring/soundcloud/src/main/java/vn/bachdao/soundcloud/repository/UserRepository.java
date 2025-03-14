package vn.bachdao.soundcloud.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import vn.bachdao.soundcloud.domain.User;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

}
