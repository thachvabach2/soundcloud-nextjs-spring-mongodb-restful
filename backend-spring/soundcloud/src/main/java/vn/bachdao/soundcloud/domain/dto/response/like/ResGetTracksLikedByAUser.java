package vn.bachdao.soundcloud.domain.dto.response.like;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResGetTracksLikedByAUser {
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
