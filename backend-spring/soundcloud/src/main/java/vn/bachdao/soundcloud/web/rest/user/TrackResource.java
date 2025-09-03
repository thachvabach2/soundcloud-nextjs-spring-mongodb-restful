package vn.bachdao.soundcloud.web.rest.user;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.config.Constants;
import vn.bachdao.soundcloud.domain.User;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqGetTopTrackByCategory;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqIdTrack;
import vn.bachdao.soundcloud.domain.dto.request.track.ReqSearchTrackDTO;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.domain.dto.response.ResUpdateResultDTO;
import vn.bachdao.soundcloud.service.TrackService;
import vn.bachdao.soundcloud.service.UserService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.util.annotation.ObjectIdValidator;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
@Validated
public class TrackResource {

    @Value("${soundcloud.upload.upload-file.base-uri}")
    private String baseURI;

    @Value("${soundcloud.track.hsl}")
    private String HSL_DIR;

    private final TrackService trackService;
    private final UserService userService;

    public TrackResource(TrackService trackService, UserService userService) {
        this.trackService = trackService;
        this.userService = userService;
    }

    @PostMapping("/tracks/top")
    @ApiMessage("Get top tracks by category")
    public ResponseEntity<ResPaginationDTO> getTopTracksByCategory(
            @Valid @RequestBody ReqGetTopTrackByCategory req) {
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

        return ResponseEntity.ok(this.trackService.getTrackCreatedByAUser(objectId, pageable));
    }

    @PostMapping("/tracks/increase-view")
    @ApiMessage("Increase count View (play)")
    public ResUpdateResultDTO increaseCountView(
            @RequestBody Map<String, @ObjectIdValidator(message = "TrackId không phải dạng ObjectId") String> req) {

        String trackId = req.get("trackId");

        return this.trackService.increaseCountView(trackId);
    }

    @PostMapping("/tracks/search")
    @ApiMessage("Search tracks")
    public ResponseEntity<ResPaginationDTO> searchTracksWithName(Pageable pageable,
            @RequestBody ReqSearchTrackDTO req) {
        return ResponseEntity.ok(this.trackService.searchTracksWithNameNoIndex(pageable, req.getTitle()));
    }

    @GetMapping("/tracks/stream/range/{trackUrl}")
    @ApiMessage("Stream a track")
    public ResponseEntity<Resource> streamTrack(
            @PathVariable("trackUrl") String trackUrl,
            @RequestHeader(value = "Range", required = false) String range)
            throws IdInvalidException, URISyntaxException {
        System.out.println(range);

        URI uri = new URI(baseURI + "/" + "tracks" + "/" + trackUrl);
        Path path = Paths.get(uri);

        Resource resource = new FileSystemResource(path);

        String contentType = "audio/mpeg";

        long fileLength = path.toFile().length();

        if (range == null) {
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        }

        long rangeStart;

        long rangeEnd;

        String[] ranges = range.replace("bytes=", "").split("-");
        rangeStart = Long.parseLong(ranges[0]);

        rangeEnd = rangeStart + Constants.CHUNK_SIZE - 1;

        if (rangeEnd >= fileLength) {
            rangeEnd = fileLength - 1;
        }

        System.out.println("range start : " + rangeStart);
        System.out.println("range end : " + rangeEnd);
        try (InputStream inputStream = Files.newInputStream(path)) {
            inputStream.skip(rangeStart);
            long contentLength = rangeEnd - rangeStart + 1;

            byte[] data = new byte[(int) contentLength];
            int read = inputStream.read(data, 0, data.length);
            System.out.println("read(number of bytes) : " + read);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Range", "bytes " + rangeStart + "-" + rangeEnd + "/" + fileLength);
            headers.add("x-amz-checksum-crc32c", "Ifjgig==");
            headers.setAccessControlAllowHeaders(Arrays.asList("range", "pragma",
                    "cache-control"));
            headers.setCacheControl("max-age=315360000, no-transform");
            headers.setContentLength(contentLength);

            return ResponseEntity
                    .status(HttpStatus.PARTIAL_CONTENT)
                    .headers(headers)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(new ByteArrayResource(data));

        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/tracks/{trackId}/{segment}.ts")
    public ResponseEntity<Resource> serveSegments(
            @PathVariable("trackId") String trackId,
            @PathVariable("segment") String segment) {

        // create path for segment
        Path path = Paths.get(HSL_DIR, trackId, segment + ".ts");
        if (!Files.exists(path)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Resource resource = new FileSystemResource(path);

        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.CONTENT_TYPE, "audio/mpeg")
                .body(resource);

    }

    @GetMapping("/tracks/{trackId}/master.m3u8")
    public ResponseEntity<Resource> serverMasterFile(
            @PathVariable("trackId") String trackId) {

        Path path = Paths.get(HSL_DIR, trackId, "master.m3u8");
        if (!Files.exists(path)) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Resource resource = new FileSystemResource(path);

        return ResponseEntity
                .ok()
                .header(
                        HttpHeaders.CONTENT_TYPE, "application/vnd.apple.mpegurl")
                .body(resource);
    }
}
