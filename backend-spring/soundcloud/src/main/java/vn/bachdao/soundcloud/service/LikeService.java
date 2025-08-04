package vn.bachdao.soundcloud.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.ConvertOperators;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import vn.bachdao.soundcloud.domain.Like;
import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.dto.request.like.ReqLikeDTO;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.domain.dto.response.auth.ResLoginDTO;
import vn.bachdao.soundcloud.domain.dto.response.like.ResGetTracksLikedByAUser;
import vn.bachdao.soundcloud.domain.dto.response.like.ResLikeDTO;
import vn.bachdao.soundcloud.security.SecurityUtils;
import vn.bachdao.soundcloud.util.mapper.LikeMapper;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;
import vn.bachdao.soundcloud.web.rest.errors.LikeIllegalQuantityArgumentException;
import vn.bachdao.soundcloud.web.rest.errors.UserNotAuthenticatedException;

@Service
public class LikeService {

    private final MongoTemplate mongoTemplate;
    private final LikeMapper likeMapper;

    public LikeService(TrackService trackService, MongoTemplate mongoTemplate, LikeMapper likeMapper) {
        this.mongoTemplate = mongoTemplate;
        this.likeMapper = likeMapper;
    }

    public ResLikeDTO likeOrDislikeATrack(ReqLikeDTO req) throws UserNotAuthenticatedException, IdInvalidException {

        ResLoginDTO.UserInsideToken currentUser = SecurityUtils.getClaimUserFromTokenCurrentUserLogin1()
                .orElseThrow(() -> new UserNotAuthenticatedException("User not authenticated"));

        String userId = currentUser.get_id();
        String trackId = req.getTrack();
        int reqQuantity = req.getQuantity();

        // Kiểm tra track có tồn tại không
        Query trackQuery = new Query(Criteria.where("_id").is(new ObjectId(trackId)).and("isDeleted").is(false));
        Track track = this.mongoTemplate.findOne(trackQuery, Track.class);

        if (track == null) {
            throw new IdInvalidException("Track với id: " + trackId + " không tồn tại hoặc đã xóa");
        }

        // Tìm Like hiện tại của user cho track này
        Query likeQuery = new Query(
                Criteria.where("user").is(new ObjectId(userId)).and("track").is(new ObjectId(trackId)));
        Like existingLike = this.mongoTemplate.findOne(likeQuery, Like.class);

        // Validation logic
        if (existingLike == null && reqQuantity == -1) {
            // User chưa like mà muốn unlike → Không hợp lệ
            throw new LikeIllegalQuantityArgumentException("Chưa like mà đòi dislike");
        }

        if (existingLike != null && reqQuantity == 1) {
            // User đã like mà muốn like lại → Không hợp lệ
            throw new LikeIllegalQuantityArgumentException("Đã like rồi còn đòi like tiếp");
        }

        int countLikeChange = 0;
        Like resultLike = null;

        if (existingLike == null && reqQuantity == 1) {
            // Trường hợp chưa có Like và muốn Like → tạo mới
            Like newLike = new Like();
            newLike.setUser(new ObjectId(userId));
            newLike.setTrack(new ObjectId(trackId));

            resultLike = this.mongoTemplate.insert(newLike);
            countLikeChange = 1;

        } else if (existingLike != null && reqQuantity == -1) {
            // Trường hợp đã có Like và muốn Unlike → xóa
            this.mongoTemplate.remove(likeQuery, Like.class);
            countLikeChange = -1;
            resultLike = null;
        }

        // Cập nhật countLike trong Track
        if (countLikeChange != 0) {
            Query trackUpdateQuery = new Query(Criteria.where("_id").is(trackId));

            Update trackUpdate = new Update()
                    .inc("countLike", countLikeChange);

            Track updatedTrack = this.mongoTemplate.findAndModify(
                    trackUpdateQuery, trackUpdate,
                    new FindAndModifyOptions().returnNew(true),
                    Track.class);

            // Tạo response
            ResLikeDTO resLike = new ResLikeDTO(
                    resultLike != null ? resultLike.getId() : null,
                    currentUser,
                    this.likeMapper.toResTrackInLike(updatedTrack));
            return resLike;
        }

        // Fallback (không nên đến đây)
        ResLikeDTO resLike = new ResLikeDTO(
                null,
                currentUser,
                this.likeMapper.toResTrackInLike(track));
        return resLike;
    }

    public ResPaginationDTO getTracksLikedByAUser(Pageable pageable)
            throws UserNotAuthenticatedException {

        ResLoginDTO.UserInsideToken currentUser = SecurityUtils.getClaimUserFromTokenCurrentUserLogin1()
                .orElseThrow(() -> new UserNotAuthenticatedException("User not authenticated"));

        Aggregation aggregation = Aggregation.newAggregation(
                Aggregation.match(Criteria.where("user").is(new ObjectId(currentUser.get_id()))),

                Aggregation.lookup("tracks", "track", "_id", "track"),

                Aggregation.unwind("track", true),

                Aggregation.project()
                        .and("track._id").as("_id")
                        .and("track.title").as("title")
                        .and("track.artist").as("artist")
                        .and("track.description").as("description")
                        .and("track.category").as("category")
                        .and("track.imgUrl").as("imgUrl")
                        .and("track.trackUrl").as("trackUrl")
                        .and("track.countLike").as("countLike")
                        .and("track.countPlay").as("countPlay"),

                Aggregation.facet(
                        Aggregation.sort(pageable.getSort()),
                        Aggregation.skip(pageable.getOffset()),
                        Aggregation.limit(pageable.getPageSize())).as("data")
                        .and(Aggregation.count().as("count")).as("total")

        );

        AggregationResults<Document> results = mongoTemplate.aggregate(
                aggregation, Like.class, Document.class);

        Document result = results.getUniqueMappedResult();

        // Extract data và total count
        List<ResGetTracksLikedByAUser> resTracks = new ArrayList<>();
        long totalElements = 0;

        if (result != null) {
            List<Document> dataList = result.getList("data", Document.class);
            if (dataList != null) {
                resTracks = dataList.stream()
                        .map(doc -> mongoTemplate.getConverter().read(ResGetTracksLikedByAUser.class, doc))
                        .collect(Collectors.toList());
            }

            List<Document> totalList = result.getList("total", Document.class);
            if (totalList != null && !totalList.isEmpty()) {
                totalElements = totalList.get(0).getInteger("count", 0);
            }
        }

        Page<ResGetTracksLikedByAUser> trackPage = new PageImpl<>(resTracks, pageable, totalElements);
        ResPaginationDTO res = new ResPaginationDTO();
        ResPaginationDTO.Meta meta = new ResPaginationDTO.Meta();
        meta.setPageNumber(trackPage.getNumber() + 1);
        meta.setPageSize(trackPage.getSize());
        meta.setTotalPage(trackPage.getTotalPages());
        meta.setTotalElement(trackPage.getTotalElements());

        List<ResGetTracksLikedByAUser> resCommentDTOs = trackPage.getContent();

        res.setResult(resCommentDTOs);
        res.setMeta(meta);

        return res;
    }
}