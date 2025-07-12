package vn.bachdao.soundcloud.domain.dto.response.like;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.bachdao.soundcloud.domain.dto.response.auth.ResLoginDTO;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResLikeDTO {
    @JsonProperty(value = "_id", index = 0)
    private String id;

    private Integer quantity;
    private ResLoginDTO.UserInsideToken user;
    private ResTrackInLike track;

    @Getter
    @Setter
    public static class ResTrackInLike {
        @JsonProperty(value = "_id", index = 0)
        private String id;

        private String title;
        private String description;
        private String trackUrl;
    }
}