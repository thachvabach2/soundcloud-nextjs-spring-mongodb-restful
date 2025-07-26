package vn.bachdao.soundcloud.domain;

import java.util.Set;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "playlists")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Playlist extends AbstractAuditingEntity {
    @MongoId(value = FieldType.OBJECT_ID)
    @JsonProperty(value = "_id", index = 0)
    private String id;

    private String title;
    private Boolean isPublic;
    private ObjectId user;
    private Set<ObjectId> tracks;
    private Boolean isDeleted;
}