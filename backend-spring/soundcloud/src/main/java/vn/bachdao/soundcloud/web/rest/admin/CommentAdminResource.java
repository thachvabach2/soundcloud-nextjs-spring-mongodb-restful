package vn.bachdao.soundcloud.web.rest.admin;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mongodb.client.result.DeleteResult;

import vn.bachdao.soundcloud.domain.dto.response.ResPaginationDTO;
import vn.bachdao.soundcloud.service.CommentService;
import vn.bachdao.soundcloud.util.annotation.ApiMessage;
import vn.bachdao.soundcloud.util.annotation.ObjectIdValidator;
import vn.bachdao.soundcloud.web.rest.errors.IdInvalidException;

@RestController
@RequestMapping("/api/v1")
@Validated
public class CommentAdminResource {
    private final CommentService commentService;

    public CommentAdminResource(CommentService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/comments")
    @ApiMessage("Get all comments with pagination")
    public ResponseEntity<ResPaginationDTO> getAllCommentsWithPagination(Pageable pageable) {
        return ResponseEntity.ok(this.commentService.getAllCommentsWithPagination(pageable));
    }

    @DeleteMapping("/comments/{id}")
    @ApiMessage("Delete a comment")
    public DeleteResult deleteACommentById(
            @PathVariable("id") @ObjectIdValidator(message = "commentId: lỗi format ObjectId") String commentId)
            throws IdInvalidException {
        return this.commentService.deleteACommentById(commentId);
    }
}
