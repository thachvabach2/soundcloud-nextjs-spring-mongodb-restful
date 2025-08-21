package vn.bachdao.soundcloud.domain;

import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "notifications")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Notification {
    @MongoId(value = FieldType.OBJECT_ID)
    @JsonProperty(value = "_id", index = 0)
    private String id;

    private String type; // COMMENT, LIKE, FOLLOW, REPOST
    private String fromUserId;
    private String toUserId;
    private String entityId;

    @CreatedDate
    private Instant createdAt;
}
