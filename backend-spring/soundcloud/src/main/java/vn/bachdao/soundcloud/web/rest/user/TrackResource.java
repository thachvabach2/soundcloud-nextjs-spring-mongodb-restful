package vn.bachdao.soundcloud.web.rest.user;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqGetTopTrackByCategory;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqIdTrack;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.service.TrackService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;

@RestController
@RequestMapping("/api/v1")
public class TrackResource {

    private final TrackService trackService;

    public TrackResource(TrackService trackService) {
        this.trackService = trackService;
    }

    @PostMapping("/tracks/top")
    @ApiMessage("Get top tracks by category")
    public ResponseEntity<List<Track>> getTopTracksByCategory(@Valid @RequestBody ReqGetTopTrackByCategory req) {
        return ResponseEntity.ok(this.trackService.getTopTrackByCategory(req));
    }

    @PostMapping("/tracks/users")
    @ApiMessage("Get Track created by a user")
    public ResponseEntity<ResPaginationDTO> getTrackCreatedByAUser(@Valid @RequestBody ReqIdTrack req,
            Pageable pageable) {
        return ResponseEntity.ok(this.trackService.getTrackCreatedByAUser(req.getId(), pageable));
    }
}
