package vn.bachdao.soundcloud.domain.dto.response.track;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResGetTrackDTO {
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
    private Uploader uploader;
    private Boolean isDeleted;

    private Instant createdAt;
    private Instant updatedAt;

    @Getter
    @Setter
    public static class Uploader {
        @JsonProperty(value = "_id", index = 0)
        private String id;

        private String email;
        private String name;
        private String role;
        private String type;
    }
}
