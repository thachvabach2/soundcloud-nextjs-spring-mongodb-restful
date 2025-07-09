package vn.bachdao.soundcloud.domain.dto.request.comment;

import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.Range;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import vn.bachdao.soundcloud.util.annotation.ObjectIdValidator;

@Getter
@Setter
public class ReqCreateCommentDTO {
    @NotBlank(message = "Content không được để trống")
    @Length(min = 1, max = 1000, message = "Content must be between 1 and 1000 characters")
    private String content;

    @NotNull(message = "Moment không được để trống")
    @Range(min = 0, message = "Moment phải > 0")
    private Integer moment;

    @NotNull(message = "Track không được để trống")
    @ObjectIdValidator(message = "Track: lỗi format ObjectId")
    private String track;
}