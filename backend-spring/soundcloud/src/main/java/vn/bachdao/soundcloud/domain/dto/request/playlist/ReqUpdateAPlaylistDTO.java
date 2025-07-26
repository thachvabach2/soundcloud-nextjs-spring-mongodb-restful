package vn.bachdao.soundcloud.domain.dto.request.playlist;

import java.util.Set;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import vn.bachdao.soundcloud.util.annotation.ObjectIdValidator;

@Getter
@Setter
public class ReqUpdateAPlaylistDTO {
    @NotNull(message = "Id không được được null")
    @ObjectIdValidator(message = "Id: lỗi format ObjectId")
    private String id;

    private String title;
    private Boolean isPublic;

    @ObjectIdValidator(message = "Tracks chứa ObjectId không hợp lệ")
    private Set<String> tracks;
}
