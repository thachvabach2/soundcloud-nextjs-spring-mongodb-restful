package vn.bachdao.soundcloud.domain.dto.response.comment;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import vn.bachdao.soundcloud.domain.AbstractAuditingEntity;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({ "id", "content", "moment", "user", "track", "isDeleted" })
public class ResCommentDTO extends AbstractAuditingEntity {
    @JsonProperty(value = "_id", index = 0)
    private String id;

    private String content;
    private Integer moment;
    private ResUserInComment user;
    private ResTrackInComment track;
    private Boolean isDeleted;

    @Getter
    @Setter
    public static class ResUserInComment {
        @JsonProperty(value = "_id", index = 0)
        private String id;

        private String email;
        private String name;
        private String role;
        private String type;
    }

    @Getter
    @Setter
    public static class ResTrackInComment {
        @JsonProperty(value = "_id", index = 0)
        private String id;

        private String title;
        private String description;
        private String trackUrl;
    }
}
