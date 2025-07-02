package vn.bachdao.soundcloud.web.rest.user;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqGetTopTrackByCategory;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqIdTrack;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.service.TrackService;
import vn.bachdao.soundcloud.service.UserService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
public class TrackResource {

    private final TrackService trackService;
    private final UserService userService;

    public TrackResource(TrackService trackService, UserService userService) {
        this.trackService = trackService;
        this.userService = userService;
    }

    @PostMapping("/tracks/top")
    @ApiMessage("Get top tracks by category")
    public ResponseEntity<List<Track>> getTopTracksByCategory(@Valid @RequestBody ReqGetTopTrackByCategory req) {
        return ResponseEntity.ok(this.trackService.getTopTrackByCategory(req));
    }

    @PostMapping("/tracks/users")
    @ApiMessage("Get Track created by a user")
    public ResponseEntity<ResPaginationDTO> getTrackCreatedByAUser(@Valid @RequestBody ReqIdTrack req,
            Pageable pageable) throws IdInvalidException {
        if (!ObjectId.isValid(req.getId())) {
            throw new IdInvalidException("Track với id = " + req.getId() + " lỗi");
        }
        ObjectId objectId = new ObjectId(req.getId());

        Optional<User> userOptional = this.userService.getTrackByObjectId(objectId);
        if (userOptional.isEmpty()) {
            throw new IdInvalidException("User với Id = " + req.getId() + " không tồn tại");
        }

        return ResponseEntity.ok(this.trackService.getTrackCreatedByAUser(req.getId(), pageable));
    }
}
