package vn.bachdao.soundcloud.service;

import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import vn.bachdao.soundcloud.domain.Like;
import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.dto.request.like.ReqLikeDTO;
import vn.bachdao.soundcloud.domain.dto.response.auth.ResLoginDTO;
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
        Query trackQuery = new Query(Criteria.where("_id").is(trackId).and("isDeleted").is(false));
        Track track = this.mongoTemplate.findOne(trackQuery, Track.class);

        if (track == null) {
            throw new IdInvalidException("Track với id: " + trackId + " không tồn tại hoặc đã xóa");
        }

        // Tìm Like hiện tại của user cho track này
        Query likeQuery = new Query(Criteria.where("user").is(userId).and("track").is(trackId));
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
            newLike.setQuantity(reqQuantity);
            newLike.setUser(userId);
            newLike.setTrack(trackId);

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
                    resultLike != null ? resultLike.getQuantity() : 0,
                    currentUser,
                    this.likeMapper.toResTrackInLike(updatedTrack));
            return resLike;
        }

        // Fallback (không nên đến đây)
        ResLikeDTO resLike = new ResLikeDTO(
                null,
                0,
                currentUser,
                this.likeMapper.toResTrackInLike(track));
        return resLike;
    }
}