package vn.bachdao.soundcloud.domain.dto.response.playlist;

import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Getter;
import lombok.Setter;
import vn.bachdao.soundcloud.domain.AbstractAuditingEntity;

@Getter
@Setter
@JsonPropertyOrder({ "id", "title", "isPublic", "user", "tracks", "isDeleted" })
public class ResPlaylistDTO extends AbstractAuditingEntity {
    @JsonProperty(value = "_id", index = 0)
    private String id;

    private String title;
    private Boolean isPublic;
    private UserInfo user;
    private Set<TrackInfo> tracks;
    private Boolean isDeleted;

    @Getter
    @Setter
    public static class TrackInfo {
        @JsonProperty(value = "_id", index = 0)
        private String id;

        private String title;
        private String artist;
        private String description;
        private String category;
        private String imgUrl;
        private String trackUrl;
        private Integer countLike;
        private Integer countPlay;
    }

    @Getter
    @Setter
    public static class UserInfo {
        @JsonProperty(value = "_id", index = 0)
        private String id;

        private String username;
        private String email;
        private String name;
        private String role;
        private String type;
    }
}
