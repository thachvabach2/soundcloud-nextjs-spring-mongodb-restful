package vn.bachdao.soundcloud.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;

import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqCreateTrackDTO;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqGetTopTrackByCategory;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqUpdateTrackDTO;
import vn.bachdao.soundcloud.security.SecurityUtils;
import vn.bachdao.soundcloud.util.mapper.TrackMapper;

@Service
public class TrackService {

    private final MongoTemplate mongoTemplate;
    private final TrackMapper trackMapper;
    private ObjectMapper objectMapper;

    public TrackService(MongoTemplate mongoTemplate, TrackMapper trackMapper, ObjectMapper objectMapper) {
        this.mongoTemplate = mongoTemplate;
        this.trackMapper = trackMapper;
        this.objectMapper = objectMapper;
    }

    public Track createTrack(ReqCreateTrackDTO reqTrack) {
        Track track = trackMapper.toTrack(reqTrack);
        updateUploader(track);
        track.setIsDeleted(false);
        track.setCountLike(0);
        track.setCountPlay(0);
        return mongoTemplate.save(track);
    }

    public void updateUploader(Track track) {
        Optional<Map<String, Object>> userToken = SecurityUtils.getClaimUserFromTokenCurrentUserLogin();

        if (userToken.isPresent()) {
            String userId = (String) userToken.get().get("_id");
            track.setUploader(userId);
        }
    }

    public Optional<Track> getTrackById(ObjectId id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));

        Optional<Track> result = mongoTemplate.query(Track.class)
                .matching(query).one();

        return result;
    }

    public List<Track> getAllTracks(Query query, Pageable pageable) {
        List<Track> tracks = mongoTemplate.find(query.with(pageable), Track.class);
        return tracks;
    }

    public UpdateResult updateTrack(ObjectId id, ReqUpdateTrackDTO reqTrack) {

        Query query = new Query(Criteria.where("_id").is(id));

        Update update = new Update();

        Map<String, Object> updateFields = objectMapper.convertValue(reqTrack, Map.class);
        updateFields.entrySet().stream()
                .filter(entry -> entry.getValue() != null)
                .forEach(entry -> update.set(entry.getKey(), entry.getValue()));

        UpdateResult result = mongoTemplate.updateFirst(query, update, Track.class);
        return result;
    }

    public DeleteResult deleteTrackById(ObjectId id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));

        DeleteResult result = mongoTemplate.remove(query, Track.class);

        return result;
    }

    public List<Track> getTopTrackByCategory(ReqGetTopTrackByCategory req) {
        Sort desTrackByCountPlay = Sort.by(Sort.Direction.DESC, "countPlay");
        Sort desTrackByCountLike = Sort.by(Sort.Direction.DESC, "countLike");

        Query query = new Query();
        query
                .addCriteria(Criteria.where("category").is(req.getCategory()))
                .limit(req.getLimit())
                .with(desTrackByCountPlay)
                .with(desTrackByCountLike);

        List<Track> tracks = mongoTemplate.query(Track.class).matching(query).all();
        return tracks;
    }
}