package vn.bachdao.soundcloud.domain.dto.request.track;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCreateTrackDTO {
    private String title;
    private String artist;
    private String description;

    @NotBlank(message = "TrackUrl không được để trống")
    private String trackUrl;

    @NotBlank(message = "Image không được để trống")
    private String imgUrl;
    private String category;
}
