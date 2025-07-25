package vn.bachdao.soundcloud.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConvertOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import vn.bachdao.soundcloud.web.rest.errors.UserNotAuthenticatedException;

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

    public ResGetTrackDTO createTrack(ReqCreateTrackDTO reqTrack)
            throws IdInvalidException, UserNotAuthenticatedException {
        Track track = trackMapper.toTrack(reqTrack);
        User userInToken = getUserFromToken();
        track.setUploader(new ObjectId(userInToken.getId()));
        track.setIsDeleted(false);
        track.setCountLike(0);
        track.setCountPlay(0);
        Track trackDB = mongoTemplate.save(track);

        ResGetTrackDTO resGetTrackDTO = this.trackMapper.toResGetTrackDTO(trackDB);
        ResGetTrackDTO.Uploader resUploader = new ResGetTrackDTO.Uploader();
        resUploader.setId(userInToken.getId());
        resUploader.setEmail(userInToken.getEmail());
        resUploader.setName(userInToken.getName());
        resUploader.setRole(userInToken.getRole());
        resUploader.setType(userInToken.getType());

        resGetTrackDTO.setUploader(resUploader);
        return resGetTrackDTO;
    }

    public User getUserFromToken() throws IdInvalidException, UserNotAuthenticatedException {
        Map<String, Object> userToken = SecurityUtils.getClaimUserFromTokenCurrentUserLogin()
                .orElseThrow(() -> new UserNotAuthenticatedException("User not authenticated"));

        String userId = (String) userToken.get("_id");

        User user = this.userService.getUserById(userId)
                .orElseThrow(() -> new IdInvalidException("UserId = " + userId + " trong jwt token không hợp lệ"));

        return user;
    }

    public Optional<Track> getTrackById(ObjectId id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id).and("isDeleted").is(false));

        Optional<Track> result = mongoTemplate.query(Track.class)
                .matching(query).one();

        return result;
    }

    public ResPaginationDTO getAllTracks(Query query, Pageable pageable) {
        Query newQuery = query.with(pageable);
        newQuery.addCriteria(Criteria.where("isDeleted").is(false));

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

        Query query = new Query(Criteria.where("_id").is(id).and("isDeleted").is(false));

        Update update = new Update();

        Map<String, Object> updateFields = objectMapper.convertValue(reqTrack, Map.class);
        updateFields.entrySet().stream()
                .filter(entry -> entry.getValue() != null)
                .forEach(entry -> update.set(entry.getKey(), entry.getValue()));

        UpdateResult result = mongoTemplate.updateFirst(query, update, Track.class);
        return result;
    }

    public UpdateResult deleteTrackById(ObjectId id) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(id));

        // force delete
        // DeleteResult result = mongoTemplate.remove(query, Track.class);

        // soft delete - cần dùng schedule để Cleanup job (xóa định kỳ)
        Update update = new Update().set("isDeleted", true);
        UpdateResult result = mongoTemplate.updateFirst(query, update, Track.class);

        return result;
    }

    public ResPaginationDTO getTopTrackByCategory(ReqGetTopTrackByCategory req) {
        //
        Sort desTrackByCountPlay = Sort.by(Sort.Direction.DESC, "countPlay");
        Sort desTrackByCountLike = Sort.by(Sort.Direction.DESC, "countLike");

        Aggregation aggregation = Aggregation.newAggregation(
                // Lọc comments chưa bị xóa
                Aggregation.match(Criteria.where("isDeleted").is(false).and("category").is(req.getCategory())),

                // Convert string IDs to ObjectId
                Aggregation.addFields()
                        .addField("uploaderObjectId").withValue(ConvertOperators.ToObjectId.toObjectId("$uploader"))
                        .build(),

                // Lookup để join với users và tracks
                Aggregation.lookup("users", "uploaderObjectId", "_id", "uploader"),

                // Unwind arrays
                Aggregation.unwind("uploader", true),

                // Project các fields cần thiết
                Aggregation.project()
                        .and("_id").as("_id")
                        .and("title").as("title")
                        .and("artist").as("artist")
                        .and("description").as("description")
                        .and("category").as("category")
                        .and("imgUrl").as("imgUrl")
                        .and("trackUrl").as("trackUrl")
                        .and("countLike").as("countLike")
                        .and("countPlay").as("countPlay")

                        .and("uploader._id").as("uploader._id")
                        .and("uploader.email").as("uploader.email")
                        .and("uploader.name").as("uploader.name")
                        .and("uploader.role").as("uploader.role")
                        .and("uploader.type").as("uploader.type")

                        .and("isDeleted").as("isDeleted")
                        .and("createdAt").as("createdAt")
                        .and("updatedAt").as("updatedAt"),

                // Sort operations
                Aggregation.sort(desTrackByCountPlay),
                Aggregation.sort(desTrackByCountLike),

                // Limit results
                Aggregation.limit(req.getLimit()));

        AggregationResults<ResGetTrackDTO> results = mongoTemplate.aggregate(
                aggregation, "tracks", ResGetTrackDTO.class);

        List<ResGetTrackDTO> tracks = results.getMappedResults();

        Page<ResGetTrackDTO> trackPage = new PageImpl<>(tracks, Pageable.unpaged(), tracks.size());

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

    public ResPaginationDTO getTrackCreatedByAUser(ObjectId id, Pageable pageable) {
        Query query = new Query();
        query.addCriteria(Criteria.where("uploader").is(id).and("isDeleted").is(false)).with(pageable);

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

    public void validateTrackExists(ObjectId trackId) throws IdInvalidException {
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