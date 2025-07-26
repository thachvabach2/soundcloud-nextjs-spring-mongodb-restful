package vn.bachdao.soundcloud.repository;

import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import vn.bachdao.soundcloud.domain.Track;

@Repository
public interface TrackRepository extends MongoRepository<Track, String> {
    Set<Track> findByIdIn(Set<ObjectId> ids);
}