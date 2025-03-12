package vn.bachdao.soundcloud.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import vn.bachdao.soundcloud.domain.Author;

@Repository
public interface AuthorRepository extends MongoRepository<Author, String> {

}