package vn.bachdao.soundcloud.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConvertOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.mongodb.client.result.DeleteResult;

import vn.bachdao.soundcloud.domain.Comment;
import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.dto.request.comment.ReqCreateCommentDTO;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.domain.dto.response.comment.ResCommentDTO;
import vn.bachdao.soundcloud.security.SecurityUtils;
import vn.bachdao.soundcloud.service.event.NotificationEvent;
import vn.bachdao.soundcloud.util.mapper.CommentMapper;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;
import vn.bachdao.soundcloud.web.rest.errors.UserNotAuthenticatedException;

@Service
public class CommentService {
    private final MongoTemplate mongoTemplate;
    private final CommentMapper commentMapper;
    private final TrackService trackService;
    private final ApplicationEventPublisher applicationEventPublisher;

    public CommentService(MongoTemplate mongoTemplate,
            CommentMapper commentMapper,
            TrackService trackService,
            ApplicationEventPublisher applicationEventPublisher) {
        this.mongoTemplate = mongoTemplate;
        this.commentMapper = commentMapper;
        this.trackService = trackService;
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public ResCommentDTO createACommentOnATrack(ReqCreateCommentDTO req)
            throws IdInvalidException, UserNotAuthenticatedException {
        Optional<String> currentUserIdLoginOptional = SecurityUtils.getCurrentUserLogin();
        if (currentUserIdLoginOptional.isEmpty()) {
            throw new UserNotAuthenticatedException("User not authenticated");
        }

        Track trackDb = this.trackService.validateTrackExists(new ObjectId(req.getTrack()));

        Comment comment = this.commentMapper.toComment(req);
        comment.setUser(currentUserIdLoginOptional.get());

        Comment newComment = mongoTemplate.insert(comment);

        NotificationEvent notificationEvent = new NotificationEvent(
                this,
                "COMMENT",
                newComment.getUser(),
                trackDb.getUploader().toHexString(),
                newComment.getId());

        applicationEventPublisher.publishEvent(notificationEvent);

        return getCommentWithPopulatedData(newComment.getId());
    }

    private ResCommentDTO getCommentWithPopulatedData(String commentId) {
        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("_id").is(commentId).and("isDeleted").is(false)),

                Aggregation.addFields()
                        .addField("userObjectId").withValue(ConvertOperators.ToObjectId.toObjectId("$user"))
                        .addField("trackObjectId").withValue(ConvertOperators.ToObjectId.toObjectId("$track"))
                        .build(),

                Aggregation.lookup("users", "userObjectId", "_id", "user"),
                Aggregation.lookup("tracks", "trackObjectId", "_id", "track"),

                Aggregation.unwind("user", true),
                Aggregation.unwind("track", true),

                Aggregation.project()
                        .and("_id").as("id")
                        .and("content").as("content")
                        .and("moment").as("moment")

                        .and("user._id").as("user._id")
                        .and("user.name").as("user.name")
                        .and("user.email").as("user.email")
                        .and("user.role").as("user.role")
                        .and("user.type").as("user.type")

                        .and("track._id").as("track._id")
                        .and("track.title").as("track.title")
                        .and("track.description").as("track.description")
                        .and("track.trackUrl").as("track.trackUrl")

                        .and("isDeleted").as("isDeleted")
                        .and("createdAt").as("createdAt")
                        .and("updatedAt").as("updatedAt")
                        .and("createdBy").as("createdBy")
                        .and("updatedBy").as("updatedBy"));

        AggregationResults<ResCommentDTO> results = mongoTemplate
                .aggregate(aggregation, "comments", ResCommentDTO.class);

        ResCommentDTO resCommentDTO = results.getUniqueMappedResult();

        return resCommentDTO;
    }

    public ResPaginationDTO getAllCommentsWithPagination(Pageable pageable) {
        Aggregation aggregation = Aggregation.newAggregation(
                // Lọc comments chưa bị xóa
                Aggregation.match(Criteria.where("isDeleted").is(false)),

                // Convert string IDs to ObjectId
                Aggregation.addFields()
                        .addField("userObjectId").withValue(ConvertOperators.ToObjectId.toObjectId("$user"))
                        .addField("trackObjectId").withValue(ConvertOperators.ToObjectId.toObjectId("$track"))
                        .build(),

                // Lookup để join với users và tracks
                Aggregation.lookup("users", "userObjectId", "_id", "user"),
                Aggregation.lookup("tracks", "trackObjectId", "_id", "track"),

                // Unwind arrays
                Aggregation.unwind("user", true),
                Aggregation.unwind("track", true),

                // Project các fields cần thiết
                Aggregation.project()
                        .and("_id").as("id")
                        .and("content").as("content")
                        .and("moment").as("moment")

                        .and("user._id").as("user._id")
                        .and("user.name").as("user.name")
                        .and("user.email").as("user.email")
                        .and("user.role").as("user.role")
                        .and("user.type").as("user.type")

                        .and("track._id").as("track._id")
                        .and("track.title").as("track.title")
                        .and("track.description").as("track.description")
                        .and("track.trackUrl").as("track.trackUrl")

                        .and("isDeleted").as("isDeleted")
                        .and("createdAt").as("createdAt")
                        .and("updatedAt").as("updatedAt")
                        .and("createdBy").as("createdBy")
                        .and("updatedBy").as("updatedBy"),

                // Sử dụng facet để count và paginate trong 1 query
                Aggregation.facet(
                        Aggregation.skip(pageable.getOffset()),
                        Aggregation.limit(pageable.getPageSize())).as("data")
                        .and(Aggregation.count().as("count")).as("total"));

        AggregationResults<Document> results = mongoTemplate.aggregate(
                aggregation, "comments", Document.class);

        Document result = results.getUniqueMappedResult();

        // Extract data và total count
        List<ResCommentDTO> comments = new ArrayList<>();
        long totalElements = 0;

        if (result != null) {
            List<Document> dataList = result.getList("data", Document.class);
            if (dataList != null) {
                comments = dataList.stream()
                        .map(doc -> mongoTemplate.getConverter().read(ResCommentDTO.class, doc))
                        .collect(Collectors.toList());
            }

            List<Document> totalList = result.getList("total", Document.class);
            if (totalList != null && !totalList.isEmpty()) {
                totalElements = totalList.get(0).getInteger("count", 0);
            }
        }

        Page<ResCommentDTO> commentPage = new PageImpl<>(comments, pageable, totalElements);
        ResPaginationDTO res = new ResPaginationDTO();
        ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();
        meta.setPageNumber(commentPage.getNumber() + 1);
        meta.setPageSize(commentPage.getSize());
        meta.setTotalPage(commentPage.getTotalPages());
        meta.setTotalElement(commentPage.getTotalElements());

        List<ResCommentDTO> resCommentDTOs = commentPage.getContent();

        res.setResult(resCommentDTOs);
        res.setMeta(meta);

        return res;
    }

    public DeleteResult deleteACommentById(String commentId) throws IdInvalidException {
        validateCommentExists(commentId);

        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(commentId));

        DeleteResult result = mongoTemplate.remove(query, Comment.class);

        return result;
    }

    public void validateCommentExists(String commentId) throws IdInvalidException {
        Query query = new Query(Criteria.where("_id").is(commentId).and("isDeleted").is(false));
        boolean trackExists = mongoTemplate.exists(query, Comment.class);

        if (!trackExists) {
            throw new IdInvalidException("Comment với id = " + commentId + " không tồn tại");
        }
    }

    public ResPaginationDTO getCommentsByATrack(Pageable pageable, String trackId) {
        Aggregation aggregation = Aggregation.newAggregation(
                // Lọc comments chưa bị xóa
                Aggregation.match(Criteria.where("isDeleted").is(false).and("track").is(trackId)),

                // Convert string IDs to ObjectId
                Aggregation.addFields()
                        .addField("userObjectId").withValue(ConvertOperators.ToObjectId.toObjectId("$user"))
                        .addField("trackObjectId").withValue(ConvertOperators.ToObjectId.toObjectId("$track"))
                        .build(),

                // Lookup để join với users và tracks
                Aggregation.lookup("users", "userObjectId", "_id", "user"),
                Aggregation.lookup("tracks", "trackObjectId", "_id", "track"),

                // Unwind arrays
                Aggregation.unwind("user", true),
                Aggregation.unwind("track", true),

                // Project các fields cần thiết
                Aggregation.project()
                        .and("_id").as("id")
                        .and("content").as("content")
                        .and("moment").as("moment")

                        .and("user._id").as("user._id")
                        .and("user.name").as("user.name")
                        .and("user.email").as("user.email")
                        .and("user.role").as("user.role")
                        .and("user.type").as("user.type")

                        .and("track._id").as("track._id")
                        .and("track.title").as("track.title")
                        .and("track.description").as("track.description")
                        .and("track.trackUrl").as("track.trackUrl")

                        .and("isDeleted").as("isDeleted")
                        .and("createdAt").as("createdAt")
                        .and("updatedAt").as("updatedAt")
                        .and("createdBy").as("createdBy")
                        .and("updatedBy").as("updatedBy"),

                // Sử dụng facet để count và paginate trong 1 query
                Aggregation.facet(
                        Aggregation.sort(pageable.getSort()),
                        Aggregation.skip(pageable.getOffset()),
                        Aggregation.limit(pageable.getPageSize())).as("data")
                        .and(Aggregation.count().as("count")).as("total"));

        AggregationResults<Document> results = mongoTemplate.aggregate(
                aggregation, "comments", Document.class);

        Document result = results.getUniqueMappedResult();

        // Extract data và total count
        List<ResCommentDTO> comments = new ArrayList<>();
        long totalElements = 0;

        if (result != null) {
            List<Document> dataList = result.getList("data", Document.class);
            if (dataList != null) {
                comments = dataList.stream()
                        .map(doc -> mongoTemplate.getConverter().read(ResCommentDTO.class, doc))
                        .collect(Collectors.toList());
            }

            List<Document> totalList = result.getList("total", Document.class);
            if (totalList != null && !totalList.isEmpty()) {
                totalElements = totalList.get(0).getInteger("count", 0);
            }
        }

        Page<ResCommentDTO> commentPage = new PageImpl<>(comments, pageable, totalElements);
        ResPaginationDTO res = new ResPaginationDTO();
        ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();
        meta.setPageNumber(commentPage.getNumber() + 1);
        meta.setPageSize(commentPage.getSize());
        meta.setTotalPage(commentPage.getTotalPages());
        meta.setTotalElement(commentPage.getTotalElements());

        List<ResCommentDTO> resCommentDTOs = commentPage.getContent();

        res.setResult(resCommentDTOs);
        res.setMeta(meta);

        return res;
    }
}