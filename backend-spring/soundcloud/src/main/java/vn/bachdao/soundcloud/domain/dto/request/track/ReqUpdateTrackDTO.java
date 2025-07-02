package vn.bachdao.soundcloud.domain.dto.request.track;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqUpdateTrackDTO {

    @NotBlank(message = "Title không được để trống")
    private String title;
    private String artist;
    private String description;
    private String category;
}
