package vn.bachdao.soundcloud.web.rest.user;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.dto.request.like.ReqLikeDTO;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.domain.dto.response.like.ResLikeDTO;
import vn.bachdao.soundcloud.service.LikeService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;
import vn.bachdao.soundcloud.web.rest.errors.UserNotAuthenticatedException;

@RestController
@RequestMapping("/api/v1")
public class LikeResource {

    private final LikeService likeService;

    public LikeResource(LikeService likeService) {
        this.likeService = likeService;
    }

    @PostMapping("/likes")
    @ApiMessage("Like/Dislike a track")
    public ResponseEntity<ResLikeDTO> likeOrDislikeATrack(@Valid @RequestBody ReqLikeDTO req)
            throws UserNotAuthenticatedException, IdInvalidException {
        return ResponseEntity.ok(this.likeService.likeOrDislikeATrack(req));
    }

    @GetMapping("/likes")
    @ApiMessage("Get tracks liked by a user")
    public ResponseEntity<ResPaginationDTO> getTracksLikedByAUser(Pageable pageable)
            throws UserNotAuthenticatedException {
        return ResponseEntity.ok(this.likeService.getTracksLikedByAUser(pageable));
    }
}