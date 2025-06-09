package vn.bachdao.soundcloud.domain;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "tracks")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Track extends AbstractAuditingEntity {

    @MongoId(value = FieldType.OBJECT_ID)
    @JsonProperty(value = "_id", index = 0)
    private String id;

    @NotBlank(message = "Title không được để trống")
    private String title;

    private String description;

    @NotBlank(message = "TrackUrl không được để trống")
    private String trackUrl;
    private String imgUrl;
    private Integer countLike;
    private Integer countPlay;
    private Boolean isDeleted;

    private String uploader;
    private String category;
}