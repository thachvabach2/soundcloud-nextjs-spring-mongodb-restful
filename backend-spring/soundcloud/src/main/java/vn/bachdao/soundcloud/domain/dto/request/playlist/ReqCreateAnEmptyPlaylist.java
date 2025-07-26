package vn.bachdao.soundcloud.domain.dto.request.playlist;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReqCreateAnEmptyPlaylist {
    @NotBlank(message = "Title không được để trống")
    private String title;

    @NotNull(message = "IsPublic không được để trống")
    private Boolean isPublic;
}
