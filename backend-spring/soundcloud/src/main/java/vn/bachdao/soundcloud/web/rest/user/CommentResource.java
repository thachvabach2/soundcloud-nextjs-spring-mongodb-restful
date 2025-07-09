package vn.bachdao.soundcloud.web.rest.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import vn.bachdao.soundcloud.domain.dto.request.comment.ReqCreateCommentDTO;
import vn.bachdao.soundcloud.domain.dto.response.comment.ResCommentDTO;
import vn.bachdao.soundcloud.service.CommentService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;
import vn.bachdao.soundcloud.web.rest.errors.UserNotAuthenticatedException;

@RestController
@RequestMapping("/api/v1")
public class CommentResource {
    private final CommentService commentService;

    public CommentResource(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/comments")
    @ApiMessage("Create a comment on track")
    public ResponseEntity<ResCommentDTO> createACommentOnATrack(@Valid @RequestBody ReqCreateCommentDTO req)
            throws IdInvalidException, UserNotAuthenticatedException {
        return ResponseEntity.ok(this.commentService.createACommentOnATrack(req));
    }
}