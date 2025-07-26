package vn.bachdao.soundcloud.web.rest.user;

import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.client.result.UpdateResult;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.dto.request.playlist.ReqCreateAnEmptyPlaylist;
import vn.bachdao.soundcloud.domain.dto.request.playlist.ReqUpdateAPlaylistDTO;
import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.domain.dto.response.playlist.ResPlaylistDTO;
import vn.bachdao.soundcloud.service.PlaylistService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.util.annotation.ObjectIdValidator;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;
import vn.bachdao.soundcloud.web.rest.errors.UserNotAuthenticatedException;

@RestController
@RequestMapping("/api/v1")
@Validated
public class PlaylistResource {

    private final PlaylistService playlistService;

    public PlaylistResource(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @PostMapping("/playlists/empty")
    @ApiMessage("Create an empty playlist")
    public ResponseEntity<ResPlaylistDTO> createAnEmptyPlaylist(@Valid @RequestBody ReqCreateAnEmptyPlaylist req)
            throws UserNotAuthenticatedException, IdInvalidException {
        return ResponseEntity.status(HttpStatus.CREATED).body(this.playlistService.createAnEmptyPlaylist(req));
    }

    @PatchMapping("/playlists")
    @ApiMessage("Update a playlist")
    public ResponseEntity<ResPlaylistDTO> updateAPlaylist(@Valid @RequestBody ReqUpdateAPlaylistDTO req)
            throws UserNotAuthenticatedException, IdInvalidException {
        return ResponseEntity.ok(this.playlistService.updateAPlaylist(req));
    }

    @DeleteMapping("/playlists/{id}")
    @ApiMessage("Delete a playlist")
    public ResponseEntity<UpdateResult> deleteAPlaylist(
            @PathVariable("id") @ObjectIdValidator(message = "PlaylistId: lỗi format ObjectId") String id)
            throws UserNotAuthenticatedException, IdInvalidException {
        return ResponseEntity.ok(this.playlistService.deleteAPlaylistById(id));
    }

    @GetMapping("/playlists/{id}")
    @ApiMessage("Fetch a playlist by id")
    public ResponseEntity<ResPlaylistDTO> getAPlaylistById(
            @PathVariable("id") @ObjectIdValidator(message = "PlaylistId: lỗi format ObjectId") String id)
            throws IdInvalidException {
        return ResponseEntity.ok(this.playlistService.getAPlaylistById(id));
    }

    @GetMapping("/playlists")
    @ApiMessage("Fetch playlists with pagination")
    public ResponseEntity<ResPaginationDTO> getPlaylistsWithPagination(Pageable pageable) {
        return ResponseEntity.ok(this.playlistService.getPlaylistsWithPagination(pageable));
    }

    @PostMapping("/playlists/by-user")
    @ApiMessage("Fetch User's playlists")
    public ResponseEntity<ResPaginationDTO> getPlaylistsByUser(Pageable pageable) throws UserNotAuthenticatedException {
        return ResponseEntity.ok(this.playlistService.getPlaylistsByUser(pageable));
    }
}