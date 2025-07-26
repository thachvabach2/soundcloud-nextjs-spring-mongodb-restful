package vn.bachdao.soundcloud.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import vn.bachdao.soundcloud.domain.Playlist;
import java.util.List;
import org.bson.types.ObjectId;

@Repository
public interface PlaylistRepository extends MongoRepository<Playlist, String> {
    Optional<Playlist> findByIdAndIsDeletedFalse(String id);

    List<Playlist> findByUser(ObjectId user);
}
