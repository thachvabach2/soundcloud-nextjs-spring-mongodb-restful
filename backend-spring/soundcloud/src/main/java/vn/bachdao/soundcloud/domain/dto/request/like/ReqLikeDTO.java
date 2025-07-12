package vn.bachdao.soundcloud.domain.dto.request.like;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import vn.bachdao.soundcloud.util.annotation.ObjectIdValidator;
import vn.bachdao.soundcloud.util.annotation.QuantityValidator;

@Getter
@Setter
public class ReqLikeDTO {
    @NotBlank(message = "Track không được để trống")
    @ObjectIdValidator(message = "Track lỗi cast ObjectId")
    private String track;

    @NotNull(message = "Quantity không được để trống")
    @QuantityValidator(message = "Quantity chỉ được phép là 1 hoặc -1")
    private Integer quantity;
}