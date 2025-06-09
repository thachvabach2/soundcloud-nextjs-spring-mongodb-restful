package vn.bachdao.soundcloud.domain.dto.request.track;

import org.hibernate.validator.constraints.Range;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqGetTopTrackByCategory {

    @NotBlank(message = "Category không được để trống")
    private String category;

    @NotNull()
    @Range(min = 1, message = "Limit phải là số nguyên, không được để trống hoặc >= 1")
    private int limit;
}
