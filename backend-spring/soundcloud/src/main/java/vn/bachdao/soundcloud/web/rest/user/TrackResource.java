package vn.bachdao.soundcloud.web.rest.user;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqGetTopTrackByCategory;
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
    public List<Track> getTopTracksByCategory(@Valid @RequestBody ReqGetTopTrackByCategory req) {
        return this.trackService.getTopTrackByCategory(req);
    }
}
