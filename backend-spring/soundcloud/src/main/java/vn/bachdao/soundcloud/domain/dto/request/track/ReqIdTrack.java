package vn.bachdao.soundcloud.domain.dto.request.track;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqIdTrack {
    @NotBlank(message = "Id không được để trống")
    private String id;
}
