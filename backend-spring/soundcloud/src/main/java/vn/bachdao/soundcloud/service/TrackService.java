package vn.bachdao.soundcloud.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;

import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqCreateTrackDTO;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqGetTopTrackByCategory;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqUpdateTrackDTO;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.domain.dto.response.ResUpdateResultDTO;
import vn.bachdao.soundcloud.domain.dto.response.track.ResGetTrackDTO;
import vn.bachdao.soundcloud.security.SecurityUtils;
import vn.bachdao.soundcloud.util.mapper.TrackMapper;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;

@Service
public class TrackService {

    private final MongoTemplate mongoTemplate;
    private final TrackMapper trackMapper;
    private final ObjectMapper objectMapper;
    private final UserService userService;

    public TrackService(MongoTemplate mongoTemplate, TrackMapper trackMapper, ObjectMapper objectMapper,
            UserService userService) {
        this.mongoTemplate = mongoTemplate;
        this.trackMapper = trackMapper;
        this.objectMapper = objectMapper;
        this.userService = userService;
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

            Optional<User> userOptional = this.userService.getUserById(userId);
            if (userOptional.isPresent()) {
                User userDB = userOptional.get();

                Track.Uploader uploaderDTO = new Track.Uploader();
                uploaderDTO.setId(userDB.getId());
                uploaderDTO.setEmail(userDB.getEmail());
                uploaderDTO.setName(userDB.getName());
                uploaderDTO.setRole(userDB.getRole());
                uploaderDTO.setType(userDB.getType());

                track.setUploader(uploaderDTO);
            }
        }
    }

    public Optional<Track> getTrackById(ObjectId id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));

        Optional<Track> result = mongoTemplate.query(Track.class)
                .matching(query).one();

        return result;
    }

    public ResPaginationDTO getAllTracks(Query query, Pageable pageable) {
        Query newQuery = query.with(pageable);

        List<Track> tracks = mongoTemplate.find(newQuery, Track.class);

        Page<Track> trackPage = PageableExecutionUtils.getPage(
                tracks,
                pageable,
                () -> mongoTemplate.count(Query.of(newQuery).limit(-1).skip(-1), Track.class));

        ResPaginationDTO res = new ResPaginationDTO();
        ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();
        meta.setPageNumber(trackPage.getNumber() + 1);
        meta.setPageSize(trackPage.getSize());
        meta.setTotalPage(trackPage.getTotalPages());
        meta.setTotalElement(trackPage.getTotalElements());

        List<ResGetTrackDTO> resGetTrackDTOs = this.trackMapper.toResGetTrackDTOs(trackPage.getContent());

        res.setResult(resGetTrackDTOs);
        res.setMeta(meta);

        return res;
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

    public ResPaginationDTO getTopTrackByCategory(ReqGetTopTrackByCategory req) {
        Sort desTrackByCountPlay = Sort.by(Sort.Direction.DESC, "countPlay");
        Sort desTrackByCountLike = Sort.by(Sort.Direction.DESC, "countLike");

        Query query = new Query();
        query
                .addCriteria(Criteria.where("category").is(req.getCategory()))
                .limit(req.getLimit())
                .with(desTrackByCountPlay)
                .with(desTrackByCountLike);

        List<Track> tracks = mongoTemplate.query(Track.class).matching(query).all();

        Page<Track> trackPage = PageableExecutionUtils.getPage(
                tracks,
                Pageable.unpaged(),
                () -> mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Track.class));

        ResPaginationDTO res = new ResPaginationDTO();
        ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();
        meta.setPageNumber(trackPage.getNumber() + 1);
        meta.setPageSize(trackPage.getSize());
        meta.setTotalPage(trackPage.getTotalPages());
        meta.setTotalElement(trackPage.getTotalElements());

        res.setResult(tracks);
        res.setMeta(meta);
        return res;
    }

    public ResPaginationDTO getTrackCreatedByAUser(String id, Pageable pageable) {
        Query query = new Query();
        query.addCriteria(Criteria.where("uploader.id").is(id)).with(pageable);

        List<Track> tracks = mongoTemplate.query(Track.class).matching(query).all();

        Page<Track> trackPage = PageableExecutionUtils.getPage(
                tracks,
                pageable,
                () -> mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Track.class));

        ResPaginationDTO res = new ResPaginationDTO();
        ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();
        meta.setPageNumber(trackPage.getNumber() + 1);
        meta.setPageSize(trackPage.getSize());
        meta.setTotalPage(trackPage.getTotalPages());
        meta.setTotalElement(trackPage.getTotalElements());

        res.setResult(tracks);
        res.setMeta(meta);
        return res;
    }

    public void validateTrackExists(String trackId) throws IdInvalidException {
        Query query = new Query(Criteria.where("_id").is(trackId).and("isDeleted").is(false));
        boolean trackExists = mongoTemplate.exists(query, Track.class);

        if (!trackExists) {
            throw new IdInvalidException("Track với id = " + trackId + " không tồn tại");
        }
    }

    public ResUpdateResultDTO increaseCountView(String trackId) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(trackId));

        Update update = new Update();
        update.inc("countPlay", 1);

        UpdateResult updateResult = this.mongoTemplate.updateFirst(query, update, Track.class);

        ResUpdateResultDTO res = new ResUpdateResultDTO();
        res.setAcknowledged(updateResult.wasAcknowledged());
        res.setModifiedCount(updateResult.getModifiedCount());
        res.setUpsertId(updateResult.getUpsertedId());
        res.setUpsertCount(updateResult.getUpsertedId() != null ? 1 : 0);
        res.setMatchedCount(updateResult.getMatchedCount());

        return res;
    }
}