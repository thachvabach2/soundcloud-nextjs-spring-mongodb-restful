package vn.bachdao.soundcloud.web.rest.admin;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import com.turkraft.springfilter.boot.Filter;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.Track;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqCreateTrackDTO;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqUpdateTrackDTO;
import vn.bachdao.soundcloud.service.TrackService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
public class TrackAdminResource {

    private final TrackService trackService;

    public TrackAdminResource(TrackService trackService) {
        this.trackService = trackService;
    }

    @PostMapping("/tracks")
    @ApiMessage("Create a new track")
    public ResponseEntity<Track> createTrack(@RequestBody ReqCreateTrackDTO reqTrack) {

        return ResponseEntity.ok(trackService.createTrack(reqTrack));
    }

    @GetMapping("/tracks/{id}")
    @ApiMessage("Get track by id")
    public ResponseEntity<Track> getTrack(@PathVariable("id") String id) throws IdInvalidException {
        // check id is ObjectId
        if (!ObjectId.isValid(id)) {
            throw new IdInvalidException("Track với id = " + id + " lỗi");
        }
        ObjectId objectId = new ObjectId(id);

        // ### C1: normal
        // Optional<Track> dbTrack = this.trackService.getTrackById(objectId);
        // if (dbTrack.isEmpty()) {
        // throw new IdInvalidException("Track với id = " + id + "không tồn tại");
        // }
        // Track track = dbTrack.get();

        // ### C2: functional
        Track track = this.trackService.getTrackById(objectId)
                .orElseThrow(() -> new IdInvalidException("Track với id = " + id + " không tồn tại"));

        return ResponseEntity.ok(track);
    }

    @GetMapping("/tracks")
    @ApiMessage("Get all tracks with pagination")
    public ResponseEntity<List<Track>> getAllTracks(
            @Filter(entityClass = Track.class) Query query,
            Pageable pageable) {
        return ResponseEntity.ok(this.trackService.getAllTracks(query, pageable));
    }

    @PatchMapping("/tracks/{id}")
    @ApiMessage("Update a track")
    public ResponseEntity<UpdateResult> updateTrack(@PathVariable("id") String id,
            @Valid @RequestBody ReqUpdateTrackDTO reqTrack)
            throws IdInvalidException {
        // check id is ObjectId
        if (!ObjectId.isValid(id)) {
            throw new IdInvalidException("Track với id = " + id + " lỗi");
        }
        ObjectId objectId = new ObjectId(id);

        // check exist id
        this.trackService.getTrackById(objectId)
                .orElseThrow(() -> new IdInvalidException("Track với id = " + id + " không tồn tại"));

        return ResponseEntity.ok(this.trackService.updateTrack(objectId, reqTrack));
    }

    @DeleteMapping("/tracks/{id}")
    @ApiMessage("Delete a track")
    public ResponseEntity<DeleteResult> deleteTrack(@PathVariable("id") String id) throws IdInvalidException {
        if (!ObjectId.isValid(id)) {
            throw new IdInvalidException("Track với id = " + id + " lỗi");
        }
        ObjectId objectId = new ObjectId(id);

        // check exist id
        this.trackService.getTrackById(objectId)
                .orElseThrow(() -> new IdInvalidException("Track với id = " + id + " không tồn tại"));

        return ResponseEntity.ok(this.trackService.deleteTrackById(objectId));
    }
}