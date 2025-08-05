package vn.bachdao.soundcloud.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConvertOperators;
import org.springframework.data.mongodb.core.aggregation.FacetOperation;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.TextCriteria;
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

    public Optional<ResGetTrackDTO> getTrackById(ObjectId id) {
        Aggregation aggregation = Aggregation.newAggregation(
                // Lọc comments chưa bị xóa
                Aggregation.match(Criteria.where("_id").is(id).and("isDeleted").is(false)),

                // Lookup để join với users và tracks
                Aggregation.lookup("users", "uploader", "_id", "uploader"),

                // Unwind arrays
                Aggregation.unwind("uploader", true));

        AggregationResults<ResGetTrackDTO> results = mongoTemplate.aggregate(
                aggregation, "tracks", ResGetTrackDTO.class);

        Optional<ResGetTrackDTO> tracks = Optional.ofNullable(results.getUniqueMappedResult());

        return tracks;
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

    public ResPaginationDTO searchTracksWithName(Pageable pageable, String title) {
        List<AggregationOperation> operations = new ArrayList<>();

        // Stage 1: Text search PHẢI là stage đầu tiên nếu có
        if (title != null && !title.trim().isEmpty()) {
            TextCriteria textCriteria = TextCriteria.forDefaultLanguage().matching(title);
            operations.add(Aggregation.match(textCriteria));
        }

        // Stage 2: Match isDeleted = false
        operations.add(Aggregation.match(Criteria.where("isDeleted").is(false)));

        // Stage 3: Tính total count trước khi pagination
        FacetOperation facetOperation = Aggregation.facet()
                // Branch 1: Đếm tổng số documents
                .and(Aggregation.count().as("totalCount"))
                .as("totalCountResult")

                // Branch 2: Xử lý pagination và join
                .and(
                        // Sort theo score nếu có text search
                        title != null && !title.trim().isEmpty()
                                ? Aggregation.sort(Sort.by(Sort.Direction.DESC, "score"))
                                : Aggregation.sort(Sort.by(Sort.Direction.DESC, "createdAt")),

                        // Pagination
                        Aggregation.skip(pageable.getOffset()),
                        Aggregation.limit(pageable.getPageSize()),

                        // Lookup users
                        LookupOperation.newLookup()
                                .from("users")
                                .localField("uploader")
                                .foreignField("_id")
                                .as("uploader"),

                        // Unwind uploader
                        Aggregation.unwind("uploader", true),

                        // Project only needed fields
                        Aggregation.project()
                                .andInclude("_id", "title", "artist", "description", "category",
                                        "imgUrl", "trackUrl", "countLike", "countPlay",
                                        "uploader", "isDeleted", "createdAt", "updatedAt"))
                .as("data");

        operations.add(facetOperation);

        // Execute aggregation
        Aggregation aggregation = Aggregation.newAggregation(operations);
        AggregationResults<Document> results = mongoTemplate.aggregate(
                aggregation, "tracks", Document.class);

        Document result = results.getUniqueMappedResult();

        // Extract total count
        List<Document> totalCountResult = (List<Document>) result.get("totalCountResult");
        long totalElements = totalCountResult.isEmpty() ? 0L
                : (long) totalCountResult.get(0).getInteger("totalCount", 0);

        // Extract data
        List<Document> dataResult = (List<Document>) result.get("data");
        List<ResGetTrackDTO> tracks = dataResult.stream()
                .map(doc -> mongoTemplate.getConverter().read(ResGetTrackDTO.class, doc))
                .collect(Collectors.toList());

        // Build response
        return buildPaginationResponse(tracks, pageable, totalElements);
    }

    public ResPaginationDTO searchTracksWithNameNoIndex(Pageable pageable, String title) {
        List<AggregationOperation> operations = new ArrayList<>();

        // Stage 1: Match isDeleted = false đầu tiên để tận dụng index
        operations.add(Aggregation.match(Criteria.where("isDeleted").is(false)));

        // Stage 2: Regex search nếu có title
        if (title != null && !title.trim().isEmpty()) {
            String escapedTitle = Pattern.quote(title.trim());

            Criteria regexCriteria = new Criteria().orOperator(
                    Criteria.where("title").regex(escapedTitle, "i"),
                    Criteria.where("artist").regex(escapedTitle, "i"));

            operations.add(Aggregation.match(regexCriteria));
        }

        // Stage 3: Facet để tính count và lấy data
        FacetOperation facetOperation = Aggregation.facet()
                // Branch 1: Đếm tổng số documents
                .and(Aggregation.count().as("totalCount"))
                .as("totalCountResult")

                // Branch 2: Pagination và join
                .and(
                        // Pagination
                        Aggregation.skip(pageable.getOffset()),
                        Aggregation.limit(pageable.getPageSize()),

                        // Lookup users
                        LookupOperation.newLookup()
                                .from("users")
                                .localField("uploader")
                                .foreignField("_id")
                                .as("uploader"),

                        // Unwind uploader
                        Aggregation.unwind("uploader", true),

                        // Project only needed fields (loại bỏ titleMatch temporary field)
                        Aggregation.project()
                                .andInclude("_id", "title", "artist", "description", "category",
                                        "imgUrl", "trackUrl", "countLike", "countPlay",
                                        "uploader", "createdAt", "updatedAt"))
                .as("data");

        operations.add(facetOperation);

        // Execute aggregation
        Aggregation aggregation = Aggregation.newAggregation(operations);
        AggregationResults<Document> results = mongoTemplate.aggregate(
                aggregation, "tracks", Document.class);

        Document result = results.getUniqueMappedResult();

        // Extract total count
        List<Document> totalCountResult = (List<Document>) result.get("totalCountResult");
        long totalElements = totalCountResult.isEmpty() ? 0L
                : (long) totalCountResult.get(0).getInteger("totalCount", 0);

        // Extract data
        List<Document> dataResult = (List<Document>) result.get("data");
        List<ResGetTrackDTO> tracks = dataResult.stream()
                .map(doc -> mongoTemplate.getConverter().read(ResGetTrackDTO.class, doc))
                .collect(Collectors.toList());

        // Build response
        return buildPaginationResponse(tracks, pageable, totalElements);
    }

    private ResPaginationDTO buildPaginationResponse(List<ResGetTrackDTO> tracks,
            Pageable pageable, long totalElements) {
        int totalPages = (int) Math.ceil((double) totalElements / pageable.getPageSize());

        ResPaginationDTO res = new ResPaginationDTO();
        ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();

        meta.setPageNumber(pageable.getPageNumber() + 1);
        meta.setPageSize(pageable.getPageSize());
        meta.setTotalPage(totalPages);
        meta.setTotalElement(totalElements);

        res.setResult(tracks);
        res.setMeta(meta);

        return res;
    }
}