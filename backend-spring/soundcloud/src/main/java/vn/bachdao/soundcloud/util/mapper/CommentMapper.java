package vn.bachdao.soundcloud.util.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import vn.bachdao.soundcloud.domain.Comment;
import vn.bachdao.soundcloud.domain.dto.request.comment.ReqCreateCommentDTO;

@Mapper(componentModel = "spring", uses = {}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CommentMapper {
    Comment toComment(ReqCreateCommentDTO reqCreateCommentDTO);
}
